// const { Checkout } = require('checkout-sdk-node');
// const cko = new Checkout('sk_test_89233417-a2cf-40d0-883c-3d4f55aa77b2');
const axios = require('axios').default
const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid')
const planModel = require('../models/plans')
const userModel = require('../models/user')
const planViewsModal = require('../models/planViews')
const moment = require('moment')

exports.payment = async (req, res) => {
    let reference
    let price
    let plan
    if (Number(req.body.planId) === 1) {
        price = 2
        reference = 'one time payment'
        console.log(price)
    } else {
        plan = await planModel.findOne({ _id: req.body.planId })
        if (plan.price) {
            price = (plan.price * plan.months).toFixed(2)
            reference = plan.name
        } else {
            res.json({ error: 'Some thing went wrong ' })
            return false
        }
    }

    const resp = await fetch(`https://api.sandbox.checkout.com/payments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cko-Idempotency-Key': uuidv4().toString(),
            Authorization: 'sk_test_89233417-a2cf-40d0-883c-3d4f55aa77b2',
        },
        body: JSON.stringify({
            source: {
                type: 'token',
                token: req.body.cardToken,
            },
            amount: price * 100,
            currency: 'USD',
            payment_type: 'Regular',
            reference: reference,
            description: 'Buy Documents Views',
            capture: true,
            capture_on: '2019-09-10T10:11:12Z',
            customer: {
                email: req.session.user.email,
                name: req.session.user.userName,
            },
            risk: { enabled: false },
            success_url: 'http://example.com/payments/success',
            failure_url: 'http://example.com/payments/fail',
        }),
    })

    const data = await resp.json()

    if (data.approved) {
        setTimeout(async () => {
            if (data.id) {
                const id = data.id
                const resp = await fetch(
                    `https://api.sandbox.checkout.com/payments/${id}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization:
                                'sk_test_89233417-a2cf-40d0-883c-3d4f55aa77b2',
                        },
                    }
                )

                const paymentData = await resp.json()

                if (paymentData.approved) {
                    let planViews
                    let planName
                    let expireDate
                    if (Number(req.body.planId) === 1) {
                        req.session.user.planViews = 1
                        planViews = 1
                        planName = null
                        expireDate = moment(
                            new Date(),
                            'DD-MM-YYYY hh:mm:ss'
                        ).add(24, 'h')
                    } else {
                        req.session.user.planViews = plan.views * plan.months
                        req.session.user.plan = plan.name
                        planViews = plan.views * plan.months
                        planName = plan.name
                        if (Number(plan.months) === 12) {
                            expireDate = moment(
                                new Date(),
                                'DD-MM-YYYY hh:mm:ss'
                            ).add(1, 'years')
                        }

                        if (Number(plan.months) === 3) {
                            expireDate = moment(
                                new Date(),
                                'DD-MM-YYYY hh:mm:ss'
                            ).add(3, 'M')
                        }
                        if (Number(plan.months) === 1) {
                            expireDate = moment(
                                new Date(),
                                'DD-MM-YYYY hh:mm:ss'
                            ).add(30, 'days')
                        }
                    }

                    const buyedPlan = await planViewsModal.create({
                        planViews: planViews,
                        planName: planName,
                        buyBy: req.session.user._id,
                        expirationDate: expireDate,
                    })

                    await buyedPlan.save(function (err, results) {
                        console.log(results._id)
                    })
                }
                if (req.body.docId) {
                    res.json({ success: true, docId: req.body.docId })
                } else {
                    res.json({ success: true })
                }
            }
        }, 1000)
    } else {
        res.json({ error: data.response_summary })
    }
}
