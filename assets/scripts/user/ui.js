const notification = require('../../../lib/notifications')
const store = require('../store.js')
const templateMyImages = require('../templates/my-images-readout.handlebars')

const onSignInSuccess = function (apiResponse) {
  // storing API response (i.e., user object) to have quick access to
  // things like user._id, user.email, user.token, etc.
  store.user = apiResponse.user
  // end
  notification.alert('success', 'Successfully Signed In')
  notification.universalToast('success', 'Success!', 'Successfully signed in!')
  // change placeholder in dropdown label to user email
  $('#user-email-dropdown').text(store.user.email)
  // end
  $('#auth-view').hide()
  $('#carousel-view').show()
  $('#static-nav').show()
  // clearing sign in form on sign in success
  $('#login-form').each(function () {
    this.reset()
  })
  // end
  // storing view location to inform dom manipulation (e.g., nav button options)
  store.view = 'carousel'
  // end
}

const onSignInFailure = function () {
  notification.alert('danger', 'Login Unsuccessful')
}

const onSignUpSuccess = function () {
  notification.alert('success', 'Successfully Signed Up')
  $('#sign-up').hide()
  $('#login').show()
  // clearing sign up form on sign up success
  $('#sign-up-form').each(function () {
    this.reset()
  })
  // end
}

const onSignUpFailure = function () {
  notification.alert('danger', 'Sign Up Unsuccessful')
}

const onLogOutSuccess = () => {
  if (store.view === 'upload images') {
    $('#upload-images-page').hide()
    $('#carousel-li a').text('Upload Image')
    $('#carousel-li').prop('id', 'upload-image-li')
  }
  if (store.view === 'my images') {
    $('#my-images-page').hide()
    $('#carousel-li a').text('My Images')
    $('#carousel-li').prop('id', 'my-images-li')
  }
  if (store.view === 'carousel') {
    $('#carousel-view').hide()
  }
  notification.alert('success', 'Successfully Logged Out')
  $('#static-nav').hide()
  $('#auth-view').show()
  store.view = 'landing page'
}

const onLogOutFailure = () => {
  notification.alert('danger', 'Log-Out Unsuccessful')
}

const onChangePwdSuccess = () => {
  $('#change-pw-modal').modal('hide')
  // clearing change pwd form on success
  $('#change-pw-form').each(function () {
    this.reset()
  })
  // end
  notification.alert('success', 'Password Successfully Changed')
}

const onChangePwdFailure = () => {
  notification.alert('danger', 'Failed to Edit Password')
}

const uploadImagesView = () => {
  if (store.view === 'carousel') {
    $('#carousel-view').hide()
    $('#upload-images-page').show()
    $('#upload-image-li a').text('Carousel')
    $('#upload-image-li').prop('id', 'carousel-li')
    // change upload to carousel
  }
  if (store.view === 'my images') {
    $('#my-images-page').hide()
    $('#upload-images-page').show()
    $('#upload-image-li a').text('My Images')
    $('#upload-image-li').prop('id', 'my-images-li')
    // change upload to my Images
  }
  store.view = 'upload images'
}

const myImagesView = (apiResponse) => {
  // updating nav bar - start
  if (store.view === 'carousel') {
    $('#carousel-view').hide()
    $('#my-images-page').show()
    $('#my-images-li a').text('Carousel')
    $('#my-images-li').prop('id', 'carousel-li')
  }
  if (store.view === 'upload images') {
    $('#upload-images-page').hide()
    $('#my-images-page').show()
    $('#my-images-li a').text('Upload Image')
    $('#my-images-li').prop('id', 'upload-image-li')
  }
  store.view = 'my images'
  // updating nav bar - end
  // populate my images div - start
  console.log(apiResponse.images)
  console.log(apiResponse.images[0]._id) // worked
  console.log(apiResponse.images[0].title) // worked
  console.log(apiResponse.images[0].url) // worked
  console.log(apiResponse.images[0].description) // undefined
  console.log(apiResponse.images[0]._owner) // just an ID
  console.log(apiResponse.images[0].tags) // empty array
  // const personalImagesArr = apiResponse.images.filter(function (image) {
  //   return image.user.email === store.user.email
  // })
  const myImagesReadout = templateMyImages({ images: apiResponse.images })
  $('#my-images-page').append(myImagesReadout)
  // we will need to fix images with something like the below
  // $("div[data-class='5-" + store.npc.id + "']").css('background-image', 'url(https://imgur.com/GGHd4MP.png)')
  // $("div[data-id='image-" + apiResponse.images[0]._id + "']").css('background-image', 'url(https://nmd-wdi-bucket.s3.amazonaws.com/1b2a7f62f78ce7ac1049a022a899928c.jpg)')
  // $("div[data-id='image-5ab5a7d5b2108b19b7d5b991']").css('background-image', 'url(https://nmd-wdi-bucket.s3.amazonaws.com/1b2a7f62f78ce7ac1049a022a899928c.jpg)')
  for (let i = 0; i < apiResponse.images.length; i++) {
    $("div[data-id='image-" + apiResponse.images[i]._id + "']").css('background-image', 'url(' + apiResponse.images[i].url + ')')
  }
}

const returnToCarouselView = () => {
  if (store.view === 'upload images') {
    $('#upload-images-page').hide()
    $('#carousel-view').show()
    $('#carousel-li a').text('Upload Image')
    $('#carousel-li').prop('id', 'upload-image-li')
  }
  if (store.view === 'my images') {
    $('#my-images-page').hide()
    $('#carousel-view').show()
    $('#carousel-li a').text('My Images')
    $('#carousel-li').prop('id', 'my-images-li')
  }
  store.view = 'carousel'
}

module.exports = {
  onSignInSuccess,
  onSignInFailure,
  onSignUpSuccess,
  onSignUpFailure,
  onLogOutSuccess,
  onLogOutFailure,
  onChangePwdSuccess,
  onChangePwdFailure,
  uploadImagesView,
  returnToCarouselView,
  myImagesView
}
