/* global Frames */
var payButton = document.getElementById('pay-button')
var form = document.getElementById('payment-form')
let cardToken
Frames.init('pk_test_b5042a45-a574-4271-abf8-6e24bd3b649b')

var logos = generateLogos()
function generateLogos() {
    var logos = {}
    logos['card-number'] = {
        src: 'card',
        alt: 'card number logo',
    }
    logos['expiry-date'] = {
        src: 'exp-date',
        alt: 'expiry date logo',
    }
    logos['cvv'] = {
        src: 'cvv',
        alt: 'cvv logo',
    }
    return logos
}

var errors = {}
errors['card-number'] = 'Please enter a valid card number'
errors['expiry-date'] = 'Please enter a valid expiry date'
errors['cvv'] = 'Please enter a valid cvv code'

Frames.addEventHandler(
    Frames.Events.FRAME_VALIDATION_CHANGED,
    onValidationChanged
)
function onValidationChanged(event) {
    var e = event.element

    if (event.isValid || event.isEmpty) {
        if (e === 'card-number' && !event.isEmpty) {
            showPaymentMethodIcon()
        }
        setDefaultIcon(e)
        clearErrorIcon(e)
        clearErrorMessage(e)
    } else {
        if (e === 'card-number') {
            clearPaymentMethodIcon()
        }
        setDefaultErrorIcon(e)
        setErrorIcon(e)
        setErrorMessage(e)
    }
}

function clearErrorMessage(el) {
    var selector = '.error-message__' + el
    var message = document.querySelector(selector)
    message.textContent = ''
}

function clearErrorIcon(el) {
    var logo = document.getElementById('icon-' + el + '-error')
    logo.style.removeProperty('display')
}

function showPaymentMethodIcon(parent, pm) {
    if (parent) parent.classList.add('show')

    var logo = document.getElementById('logo-payment-method')
    if (pm) {
        var name = pm.toLowerCase()
        logo.setAttribute('src', '/images/card-icons/' + name + '.svg')
        logo.setAttribute('alt', pm || 'payment method')
    }
    logo.style.removeProperty('display')
}

function clearPaymentMethodIcon(parent) {
    if (parent) parent.classList.remove('show')

    var logo = document.getElementById('logo-payment-method')
    logo.style.setProperty('display', 'none')
}

function setErrorMessage(el) {
    var selector = '.error-message__' + el
    var message = document.querySelector(selector)
    message.textContent = errors[el]
}

function setDefaultIcon(el) {
    var selector = 'icon-' + el
    var logo = document.getElementById(selector)
    logo.setAttribute('src', '/images/card-icons/' + logos[el].src + '.svg')
    logo.setAttribute('alt', logos[el].alt)
}

function setDefaultErrorIcon(el) {
    var selector = 'icon-' + el
    var logo = document.getElementById(selector)
    logo.setAttribute(
        'src',
        '/images/card-icons/' + logos[el].src + '-error.svg'
    )
    logo.setAttribute('alt', logos[el].alt)
}

function setErrorIcon(el) {
    var logo = document.getElementById('icon-' + el + '-error')
    logo.style.setProperty('display', 'block')
}

Frames.addEventHandler(
    Frames.Events.CARD_VALIDATION_CHANGED,
    cardValidationChanged
)
function cardValidationChanged() {
    payButton.disabled = !Frames.isCardValid()
}

Frames.addEventHandler(
    Frames.Events.CARD_TOKENIZATION_FAILED,
    onCardTokenizationFailed
)
function onCardTokenizationFailed(error) {
    console.log('CARD_TOKENIZATION_FAILED: %o', error)
    Frames.enableSubmitForm()
}

Frames.addEventHandler(Frames.Events.CARD_TOKENIZED, onCardTokenized)
function onCardTokenized(event) {
    var el = document.querySelector('.success-payment-message')
    el.innerHTML = 'Card tokenization completed<br>' + '</span>'
    cardToken = event.token
}

Frames.addEventHandler(
    Frames.Events.PAYMENT_METHOD_CHANGED,
    paymentMethodChanged
)
function paymentMethodChanged(event) {
    var pm = event.paymentMethod
    let container = document.querySelector('.icon-container.payment-method')

    if (!pm) {
        clearPaymentMethodIcon(container)
    } else {
        clearErrorIcon('card-number')
        showPaymentMethodIcon(container, pm)
    }
}
// $("#payment-form").on('submit', function(e){
//     e.preventDefault();
//     alert('Payment')
// })
form.addEventListener('submit', onSubmit)
function onSubmit(event) {
    // on form submission, prevent default
    event.preventDefault()
    Frames.cardholder = {
        name: $('#cardHolder').val(),
        email: 'John@karigar.pk',
    }

    $('#paymentModal .modal-content').append(
        `<div class="preloader_modal"><div class="spinner"></div>`
    )
    Frames.submitCard()

    setTimeout(() => {
        let data = { cardToken: cardToken }

        if ($('#docId').val() !== '') {
            data = { docId: $('#docId').val(), ...data }
        }
        if ($('#PlanId').val() !== '') {
            data = { planId: $('#PlanId').val(), ...data }
        } else {
            data = { planId: 1, ...data }
        }

        $.ajax({
            type: 'POST',
            url: '/payment',
            data: data,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    form.reset()
                    toastr.success('Payment has been made successfully ')
                    setTimeout(() => {
                        $(
                            '#paymentModal .modal-content .preloader_modal'
                        ).remove()
                        $('#paymentModal').modal('hide')
                        const docUrl = localStorage.getItem('docID')

                        if (response.docId) {
                            $('.docViewBtn').click()
                        } else {
                            location.reload(true)
                        }
                    }, 1000)
                }
                if (response.error) {
                    toastr.error(response.error)
                    $('#paymentModal .modal-content .preloader_modal').remove()
                }
            },
        })
    }, 3000)
}
