const Subscriber = require('../models/Subscriber');
const Blog = require('../models/Blog');
const { formatResponse } = require('../utils/helpers');
const {
    sendWelcomeEmail,
    sendNewPostNotification,
    sendUnsubscribeConfirmation
} = require('../utils/emailService');

/**
 * Subscribe to newsletter
 * POST /api/newsletter/subscribe
 */
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json(formatResponse(false, "Email is required"));
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res
                .status(400)
                .json(formatResponse(false, "Please provide a valid email address"));
        }
        const existingSubscriber = await Subscriber.findOne({
            email: email.toLowerCase(),
        });
        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                // Always send welcome email even if already subscribed
                sendWelcomeEmail(email.toLowerCase()).catch((err) => {
                    console.error("Failed to send welcome email:", err);
                });
                return res
                    .status(400)
                    .json(
                        formatResponse(
                            false,
                            "This email is already subscribed to our newsletter"
                        )
                    );
            } else {
                existingSubscriber.isActive = true;
                existingSubscriber.subscribedAt = new Date();
                existingSubscriber.unsubscribedAt = null;
                await existingSubscriber.save();
                sendWelcomeEmail(email.toLowerCase()).catch((err) => {
                    console.error("Failed to send welcome email:", err);
                });
                return res.json(
                    formatResponse(
                        true,
                        "Welcome back! Your subscription has been reactivated",
                        existingSubscriber.toJSON()
                    )
                );
            }
        }
        const newSubscriber = new Subscriber({
            email: email.toLowerCase(),
        });
        await newSubscriber.save();
        // Always send welcome email after subscribing
        sendWelcomeEmail(email.toLowerCase()).catch((err) => {
            console.error("Failed to send welcome email:", err);
        });
        res
            .status(201)
            .json(
                formatResponse(
                    true,
                    "Successfully subscribed to the newsletter! Check your email for confirmation 🎉",
                    newSubscriber.toJSON()
                )
            );
    } catch (error) {
        console.error("Newsletter subscribe error:", error);
        if (error.code === 11000) {
            return res
                .status(400)
                .json(formatResponse(false, "This email is already subscribed"));
        }
        res
            .status(500)
            .json(
                formatResponse(false, "Failed to subscribe. Please try again later")
            );
    }
};

/**
 * Unsubscribe from newsletter
 * POST /api/newsletter/unsubscribe
 */
const unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json(formatResponse(false, "Email is required"));
        }

        const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

        if (!subscriber) {
            return res
                .status(404)
                .json(formatResponse(false, "Email not found in our subscriber list"));
        }

        if (!subscriber.isActive) {
            return res
                .status(400)
                .json(formatResponse(false, "This email is already unsubscribed"));
        }

        subscriber.isActive = false;
        subscriber.unsubscribedAt = new Date();
        await subscriber.save();

        // Send unsubscribe confirmation email (in background)
        sendUnsubscribeConfirmation(email.toLowerCase()).catch((err) => {
            console.error("Failed to send unsubscribe confirmation:", err);
        });

        res.json(
            formatResponse(
                true,
                "Successfully unsubscribed from the newsletter. Check your email for confirmation.",
                subscriber.toJSON()
            )
        );
    } catch (error) {
        console.error("Newsletter unsubscribe error:", error);
        res
            .status(500)
            .json(
                formatResponse(false, "Failed to unsubscribe. Please try again later")
            );
    }
};

/**
 * Get subscriber count (Admin only)
 * GET /api/newsletter/count
 */
const getSubscriberCount = async (req, res) => {
    try {
        const totalSubscribers = await Subscriber.countDocuments({
            isActive: true,
        });
        const totalUnsubscribed = await Subscriber.countDocuments({
            isActive: false,
        });

        res.json(
            formatResponse(true, "Subscriber count retrieved successfully", {
                activeSubscribers: totalSubscribers,
                unsubscribed: totalUnsubscribed,
                total: totalSubscribers + totalUnsubscribed,
            })
        );
    } catch (error) {
        console.error("Get subscriber count error:", error);
        res
            .status(500)
            .json(formatResponse(false, "Failed to retrieve subscriber count"));
    }
};

/**
 * Get all subscribers (Admin only)
 * GET /api/newsletter/subscribers
 */
const getSubscribers = async (req, res) => {
    try {
        const { status } = req.query;

        let query = {};
        if (status === "active") {
            query.isActive = true;
        } else if (status === "inactive") {
            query.isActive = false;
        }

        const subscribers = await Subscriber.find(query).sort({ subscribedAt: -1 });
        const subscribersJSON = subscribers.map((sub) => sub.toJSON());

        res.json(
            formatResponse(
                true,
                "Subscribers retrieved successfully",
                subscribersJSON
            )
        );
    } catch (error) {
        console.error("Get subscribers error:", error);
        res
            .status(500)
            .json(formatResponse(false, "Failed to retrieve subscribers"));
    }
};

/**
 * Send notification for a specific blog post (Admin only)
 * POST /api/newsletter/notify/:blogId
 */
const notifySubscribers = async (req, res) => {
    try {
        const { blogId } = req.params;

        // Find the blog post
        let blog = await Blog.findById(blogId);
        if (!blog) {
            blog = await Blog.findOne({ slug: blogId });
        }

        if (!blog) {
            return res.status(404).json(formatResponse(false, "Blog not found"));
        }

        if (blog.status !== "published") {
            return res
                .status(400)
                .json(formatResponse(false, "Can only notify for published blogs"));
        }

        // Get all active subscribers
        const subscribers = await Subscriber.find({ isActive: true });

        if (subscribers.length === 0) {
            return res.json(
                formatResponse(true, "No active subscribers to notify", { count: 0 })
            );
        }

        // Send notifications
        const results = await sendNewPostNotification(subscribers, blog);

        const successCount = results.filter((r) => r.success).length;
        const failCount = results.filter((r) => !r.success).length;

        res.json(
            formatResponse(true, `Notifications sent successfully`, {
                totalSubscribers: subscribers.length,
                successful: successCount,
                failed: failCount,
                results,
            })
        );
    } catch (error) {
        console.error("Send notification error:", error);
        res.status(500).json(formatResponse(false, "Failed to send notifications"));
    }
};

module.exports = {
    subscribe,
    unsubscribe,
    getSubscriberCount,
    getSubscribers,
    notifySubscribers
};
