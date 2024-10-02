class SimulatedAnnealing {
    /**
     * Constructs a new SimulatedAnnealing for okey game
     *
     * @param {Number} temperature initial temperature value for simulated annealing
     * @param {Number} coolingRate cooling value for simulated annealing
     * @param {Array.<Object>} pieces users okey pieces
     * @param {String} okeyColor specifies the current game's okey (joker) color
     * @param {Number} okeyNumber specifies the current game's okey (joker) number
     */
    constructor(temperature, coolingRate, mutationAlgorithm = Mutation.insert, pieces, okeyColor, okeyNumber) {
        this.temperature = temperature;
        this.coolingRate = coolingRate;
        this.pieces = pieces.map((piece) => new Piece(piece.color, piece.number));
        this.okeyColor = okeyColor;
        this.okeyNumber = okeyNumber;

        // Find fake okeys and set their color and number according to the real okey
        this.pieces
            .filter((piece) => piece.type === "fake_okey")
            .forEach((piece) => (piece.color = okeyColor) && (piece.number = okeyNumber));

        this.DIFFERENT_COLORS_SAME_NUMBER = 0;
        this.SAME_COLOR_SEQUENTIAL_NUMBERS = 1;
        this.SINGLE_PIECE = 2;
        this.mutationAlgorithm = mutationAlgorithm;
    }

    /**
     * Finds the (possible) best hand for a given set of pieces
     * @returns {Array.<Array.<Piece>>} possible best hand for a given set of pieces
     */
    run() {
        // create pieces arr for first solution
        let currPieces = this.pieces;

        // create current solution
        let currHand = this.generateHand(currPieces);

        // create first solution
        let bestHand = this.generateHand(currPieces);

        while (this.temperature > 1) {
            // create new pieces arr for new solution
            let newPieces = this.mutate(currPieces);
            let newHand = this.generateHand(newPieces);

            // Get fitness of solutions
            let currentFitness = this.calculateFitness(currHand);
            let neighbourFitness = this.calculateFitness(newHand);

            // console.log("Cur: ", currentFitness, "Nex: ", neighbourFitness);

            // Decide if we should accept the neighbour
            if (this.acceptanceProbability(currentFitness, neighbourFitness, this.temperature) > Math.random()) {
                currHand = newHand;
                currPieces = newPieces;
            }

            // Keep track of the best solution found
            if (this.calculateFitness(newHand) > this.calculateFitness(bestHand)) {
                bestHand = newHand;
            }

            // Cool system
            this.temperature *= this.coolingRate;
        }

        return bestHand;
    }

    /**
     * Calculates the acceptance probability for a new solution in simulated annealing.
     *
     * @param {Number} currentFitness - The fitness of the current solution.
     * @param {Number} neighbourFitness - The fitness of the neighboring solution.
     * @param {Number} temperature - The current temperature of the system
     * @returns {Number} A probability between 0 and 1 indicating whether to accept the
     * neighboring solution.
     */
    acceptanceProbability(currentFitness, neighbourFitness, temperature) {
        // If the new solution is better, accept it
        if (neighbourFitness < currentFitness) {
            return 1.0;
        }
        // If the new solution is worse, calculate an acceptance probability
        return Math.exp((currentFitness - neighbourFitness) / temperature);
    }

    /**
     * Generates a new hand based on the provided array of pieces. The
     * resulting hand is determined by the order of the pieces in the
     * array, ensuring consistent output for the same input order.
     *
     * @param {Array.<Piece>} pieces all the pieces the user has
     * @returns {Array.<Array.<Piece>>} a valid okey hand
     */
    generateHand(pieces) {
        const hand = [];

        for (let i = 0; i < pieces.length; i++) {
            const piece = pieces[i];

            if (hand.length === 0) {
                hand.push([piece]); // push a new group
                continue;
            }

            // Look for a compatible group for current piece
            let foundCompatible = false;

            // Sort the hand array (smaller groups came first)
            // hand.sort((a, b) => a.length - b.length);
            for (let j = 0; j < hand.length; j++) {
                const group = hand[j];

                // Check for group type
                let groupType = this.getType(group);

                // Let's try to fit the piece to this group based on the group type
                switch (groupType) {
                    case this.SINGLE_PIECE:
                        // If the group has only one piece, check for every type one by one until find one that fits
                        const groupPiece = group[0];

                        // Check for different colors / same number
                        if (piece.number === groupPiece.number && piece.color !== groupPiece.color) {
                            group.push(piece);
                            foundCompatible = true;
                            break;
                        }

                        // Check for same colors / sequential numbers
                        if (groupPiece.color === piece.color) {
                            if (group[0].number === piece.number + 1) {
                                // We can place the piece on the start of the group
                                group.unshift(piece);
                                foundCompatible = true;
                                break;
                            } else if (groupPiece.number === piece.number - 1) {
                                // We can place the piece on the end of the group
                                group.push(piece);
                                foundCompatible = true;
                                break;
                            }
                        }
                        break;
                    case this.DIFFERENT_COLORS_SAME_NUMBER:
                        // Check if the current piece's number is the same as this group and it's color is not in this group
                        if (group[0].number === piece.number && !group.some((p) => p.color === piece.color)) {
                            group.push(piece);
                            foundCompatible = true;
                        }
                        break;
                    case this.SAME_COLOR_SEQUENTIAL_NUMBERS:
                        // Check if the current piece's color is the same as this group and check if we can fit this
                        // piece at the start or end of this group
                        if (group[0].color === piece.color) {
                            if (group[0].number === piece.number + 1) {
                                // We can place the piece on the start of the group
                                group.unshift(piece);
                                foundCompatible = true;
                            } else if (group[group.length - 1].number === piece.number - 1) {
                                // We can place the piece on the end of the group
                                group.push(piece);
                                foundCompatible = true;
                            }
                        }
                        break;
                    default:
                        console.log("impossible");
                        break;
                }

                // If we found compatible group for this piece, no need to try other groups
                if (foundCompatible) break;
            }

            // If there is no compatible group for this piece, create a new group with it
            if (!foundCompatible) {
                hand.push([piece]);
            }
        }

        return hand;
    }

    /**
     * Takes an array and applies selected {@link SimulatedAnnealing.mutationAlgorithm}
     * @param {Array.<Piece>} pieces all the pieces the user has
     * @returns {Array.<Piece>} mutated version of the array
     */
    mutate(pieces) {
        return this.mutateOkey(this.mutationAlgorithm(pieces));
    }

    /**
     * Takes an array of pieces and mutates the okeys (jokers)
     * @param {Array.<Piece>} pieces all the pieces the user has
     * @returns {Array.<Piece>} mutated version of the array
     */
    mutateOkey(pieces) {
        pieces
            .filter((piece) => piece.type === "okey")
            .forEach(
                (okey) =>
                    (okey.number = Math.floor((1 - Math.pow(Math.random(), 2)) * 13) + 1) &&
                    (okey.color = ["red", "black", "blue", "yellow"][Math.floor(Math.random() * 4)])
            );
        return pieces;
    }

    /**
     * Calculates and returns user's hand's score by summing up the numbers of the pieces
     * @param {Array.<Array.<Piece>>} hand a user hand with valid groups
     * @returns {Number} score of this hand
     */
    calculateFitness(hand) {
        let sum = 0;

        for (let i = 0; i < hand.length; i++) {
            if (hand[i].length < 3) continue;

            for (let j = 0; j < hand[i].length; j++) {
                sum += hand[i][j].number;
            }
        }

        return sum;
    }

    /**
     * Returns the type of a group.
     *
     * @param {Array.<Piece>} group array of pieces with a valid formation
     * @returns {Number} one of three possible group type. Can only be one of these values:
     * - {@link SimulatedAnnealing.DIFFERENT_COLORS_SAME_NUMBER}
     * - {@link SimulatedAnnealing.SAME_COLOR_SEQUENTIAL_NUMBERS}
     * - {@link SimulatedAnnealing.SINGLE_PIECE}
     */
    getType(group) {
        // If the group has only one piece
        if (group.length === 1) return this.SINGLE_PIECE;

        // Check for different colors / same number
        const colorSet = new Set(group.map((piece) => piece.color));
        if (colorSet.size === group.length) {
            return this.DIFFERENT_COLORS_SAME_NUMBER;
        }

        // Check for same colors / different numbers. If the above return statements won't
        // execute that means it is not a 'different colors / same number' or 'SINGLE_PIECE'
        // type. That leaves us with one option. 'same colors / sequential numbers'.
        return this.SAME_COLOR_SEQUENTIAL_NUMBERS;
    }
}

class Piece {
    /**
     * Constructs a new Piece
     *
     * @param {Number} color color of a piece
     * @param {Number} number number of a piece
     */
    constructor(color, number) {
        this.color = color;
        this.number = number;
        this.type = color === "okey" ? "okey" : color === "fake_okey" ? "fake_okey" : "piece";
    }
}

class Mutation {
    /**
     * Takes an array and applies inserts mutation
     * @param {Array.<Array.<Piece>>} pieces all the pieces the user has
     * @returns {Array.<Array.<Piece>>} mutated version of the array
     */
    static insert(pieces) {
        const unique = [...Array(pieces.length).keys()]
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)
            .sort((a, b) => a - b); // Ensure indices are ordered

        // Create a copy of the array
        const newArr = pieces.slice();

        // Move the element at index2 to follow index1, shifting the rest along
        const value = newArr[unique[1]];
        newArr.splice(unique[1], 1); // Remove the element at index2
        newArr.splice(unique[0] + 1, 0, value); // Insert it after index1

        return newArr;
    }

    /**
     * Takes an array and applies inversion mutation
     * @param {Array.<Array.<Piece>>} pieces all the pieces the user has
     * @returns {Array.<Array.<Piece>>} mutated version of the array
     */
    static inversion(pieces) {
        const unique = [...Array(pieces.length).keys()].sort(() => Math.random() - 0.5).slice(0, 2);

        // Ensure unique[0] is less than unique[1]
        if (unique[0] > unique[1]) {
            [unique[0], unique[1]] = [unique[1], unique[0]]; // Swap
        }

        // Create a copy of the array
        const newArr = pieces.slice();

        // Invert the substring between the two indices
        while (unique[0] < unique[1]) {
            [newArr[unique[0]], newArr[unique[1]]] = [newArr[unique[1]], newArr[unique[0]]];
            unique[0]++;
            unique[1]--;
        }

        return newArr;
    }

    /**
     * Takes an array and applies scramble mutation
     * @param {Array.<Array.<Piece>>} pieces all the pieces the user has
     * @returns {Array.<Array.<Piece>>} mutated version of the array
     */
    static scramble(pieces) {
        // Generate a random subset size between 1 and pieces.length
        const subsetSize = Math.floor(Math.random() * pieces.length) + 1;

        // Generate a subset of unique random indices
        const indices = [...Array(pieces.length).keys()].sort(() => Math.random() - 0.5).slice(0, subsetSize);

        // Collect the elements at these indices
        const subset = indices.map((i) => pieces[i]);

        // Randomly rearrange the elements
        subset.sort(() => Math.random() - 0.5);

        // Create a copy of the array
        const newArr = pieces.slice();

        // Put the rearranged elements back into the new array
        indices.forEach((index, i) => {
            newArr[index] = subset[i];
        });

        return newArr;
    }

    /**
     * Takes an array and applies swap mutation
     * @param {Array.<Array.<Piece>>} pieces all the pieces the user has
     * @returns {Array.<Array.<Piece>>} mutated version of the array
     */
    static swap(pieces) {
        const unique = [...Array(pieces.length).keys()].sort(() => Math.random() - 0.5).slice(0, 2);

        // Create a copy of the array
        const newArr = pieces.slice();

        // Swap the elements at the two indices
        [newArr[unique[0]], newArr[unique[1]]] = [newArr[unique[1]], newArr[unique[0]]];

        return newArr;
    }
}

export {SimulatedAnnealing, Piece, Mutation};