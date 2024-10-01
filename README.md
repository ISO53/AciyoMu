# AciyoMu

[![GitHub Deployments](https://img.shields.io/github/deployments/ISO53/AciyoMu/:environment?label=GitHub%20Deployments&style=round-square&color=black)](https://github.com/ISO53/AciyoMu/deployments)
[![License](https://img.shields.io/badge/license-GNU-black.svg?style=round-square)](LICENSE)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ISO53/AciyoMu?style=round-square&color=black)


AciyoMu is a web application (works best on mobile) that helps you determine if your Okey (101) hand is a winning hand. Simply take a photo of your Okey (101) hand, and the app will process the image and provide you with the best possible hand and its score.

## Features

- **Image Processing**: Capture an image of your Okey hand and process it to identify the pieces.
- **Simulated Annealing**: Use simulated annealing algorithm to find the best possible hand.
- **Dynamic UI**: Display the results dynamically using Vue.js components.

## Technologies Used

- **JavaScript**
- **Vue.js**
- **Express.js**
- **Google Generative AI**
- **Simulated Annealing Algorithm**

## Installation

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

1. Clone the repository:
    ```sh
    git clone https://github.com/ISO53/AciyoMu.git
    cd AciyoMu
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```
This will start the frontend Vue.js application. To run the server part:
1. Create a `.env` file in the root directory and add your Google API key:
    ```env
    GOOGLE_API_KEY=your_google_api_key
    ```

2. Start the development server:
    ```sh
    node api/process-image.js
    ```

## Usage

1. Open the application in your browser.
2. Follow the steps to take a photo of your Okey hand.
3. Select the joker (okey) piece.
4. Submit the data to get the best possible hand and its score.

## Project Structure

- `src/components`: Vue.js components for the UI.
- `heuristic-okey-solver.js`: Contains the simulated annealing algorithm and related classes.
- `process-image.js`: Express.js server to handle image processing and simulated annealing.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE). Feel free to modify the content and structure based on your preferences and project specifics.

[![Follow me on GitHub](https://img.shields.io/github/followers/iso53?label=Follow%20%40iso53&style=social)](https://github.com/iso53) 
