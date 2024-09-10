# Wingz Test
A simplified ride-sharing driver mobile application using React Native that allows drivers to view nearby ride requests and accept or decline them. The application utilizes
Redux for state management.

### Compromises of:
* Homescreen (passenger)
* Homescreen (driver)
* Redux store

<img style="width: 480px" src="https://codingmalkio.github.io/wingztest/images/create-booking.gif">


## Getting Started
### Installation of demo:

* For Iphone Users Download [Expo Go on Appstore]((https://itunes.apple.com/app/apple-store/id982107779))
* For Android Users Download [Expo Go on Google Play](https://play.google.com/store/apps/details)

[<img style="width:200px;" src="https://codingmalkio.github.io/wingztest/images/appstore.png">](https://itunes.apple.com/app/apple-store/id982107779)
[<img style="width:200px; object-fit:cover;" height="80px" src="https://codingmalkio.github.io/wingztest/images/googleplay.png">](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en)

* Then scan this QR code using the camera app

<img style="width:250px;" src="https://codingmalkio.github.io/wingztest/images/qr.png">


## Dependencies

* Node 18.17
* Expo 51.0
* React Native 0.74.5
* @reduxjs/toolkit

## Server & App setup
### To run the app
* Clone the repository
```
cd <project folder>
nvm use 18.17 // use 18 or higher node version
npm install
npm run start
// › Press a │ open Android
// › Press i │ open iOS simulator
```
### To run the the server
```
cd <project folder>/server
npm install
```
* copy the contents of server/.env.example to .env
```
cp .env.example ./.env
```
* run the server (default port is :3333)
```
npm run start
```


## Version History

    * Initial Release

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments
