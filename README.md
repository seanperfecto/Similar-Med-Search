# Similar Medicine Search

Using only React on the front end, this single page application takes in a search from the user for a drug, and collects related medicine with that query.

### About

This application does not use a backend (no data stored to a database), so its work horse is entirely on the React lifecycle. With the help of [Facebook's Create React App](https://github.com/facebookincubator/create-react-app), I was able to set up this application quick with its boilerplate.

This simple application gives the user back related medicine with two steps:

1. The user types in a drug, which on submit, triggers sends a fetch request to `RxNorm API` to get drugs with that specific name, which get shown on the selected list.

2. The user then clicks on one of the medicine, which triggers another fetch request to `RxNorm API` to first select the main ingredient of the drug, then find similar medicine with that ingredient. These ingredients are then shown on the related list.
