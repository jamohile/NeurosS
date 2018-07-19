import {rndBool, rndTrinary} from "./evoHelpers";

class Neuron {
    /**
     * A trigger object. This describes a charge "triggering"
     * to be performed by the network.
     * @typedef {{
     *      offset:number,
     *      charge:number
     *  }} Triggerr
     */

    /**
     * A buffer object. Describes a previous incoming charge.
     * @typedef {{charge:number, phase: number}} Charge
     */

    /**
     * Describes a connection to another neuron.
     * Offset describes the index offset between this neuron and its connection.
     * Offset, rather than hard "id's" are used to allow more organic growth.
     * If surrounding connections are augmented, through mutation, this allows the connections to flexibly match
     * the mutation. The resulting randomness betters selection based mutation.
     * @typedef {
     *      {
     *          offset: number
     *          filter: number
     *          probability: number
     *      }
     * } Connection
     */

    /**
     *
     * @param {number} threshold
     * @param {number} stability
     * @param {number} filter
     * @param {Connection[]} connections
     */
    constructor({threshold, stability, filter, connections = []}) {

        /**
         * A record of all incoming charges, and the phase they came in.
         * @type {Charge[]}
         */
        this.buffer = [];

        /**
         * The minimum buffer sum required to activate.
         * @type {number}
         */
        this.threshold = threshold;

        /** The value of incoming charge to pass on to connections.
         * @type {number}
         */
        this.filter = filter;
        /**
         * The number of phases for which a charge will be retained in buffer.
         * @type {number}
         */
        this.stability = stability;

        /**
         * Connections for this neuron.
         * @type {Connection[]}
         */
        this.connections = connections;
    }

    /**
     * Given an incoming charge, compute all necessary outgoing charges.
     * @param {number} charge
     * @param {number} phase
     * @return {Trigger[]}
     */
    trigger(charge, phase) {
        /**@type{Charge}*/
        const chargeObj = {
            charge: charge,
            phase: phase
        }
        const triggers = [];
        /**
         * Remove any items from history where
         * phase is older than stability.
         */
        this.cleanBuffer(phase);

        /**
         * Add this new charge to the buffer.
         */
        this.buffer.push(chargeObj);

        /**
         * If total charge > threshold,
         * iterate through connections.
         * For each one compute filtered charge, and return all pending triggers.
         */
        const summedCharge = this.sumBuffer();
        if (summedCharge > this.threshold) {
            this.connections.forEach(connection => {
                if (Math.random() < connection.probability) {
                    triggers.push({
                        offset: connection.offset,
                        charge: summedCharge * this.filter * connection.filter
                    })
                }
            })
        }

        return triggers;
    }


    /**
     * Remove any buffer items where phase is older than stability allows.
     * @param {number} phase
     */
    cleanBuffer(phase) {
        /**
         * Iterate through backwards. As new items add to end, this means
         * we will reach the "final too old" faster.
         */
        for (let i = this.buffer.length - 1; i >= 0; i--) {
            /**Find last occurance that is too old.*/
            if (this.buffer[i].phase < phase - this.stability) {
                /**Set buffer = to only what is after this item.*/
                this.buffer = this.buffer.slice(i + 1, this.buffer.length - 1);
                break;
            }
        }
    }

    /** Find the total accumulated charge in the buffer.
     * @return {number}
     */
    sumBuffer() {
        return this.buffer.reduce((sum, charge) => sum + charge.charge, 0);
    }

    /**
     * Breed two neurons to return a third one, with mutations possible.
     * @param {Neuron} a
     * @param {Neuron} b
     * @return {Neuron}
     */
    static cross(a, b) {
        /**
         * Initialize properties for a hybrid neuron.
         * For each property, there is a 50% chance of a or b.
         * Init connections to an empty array though, that is seperate.
         */
        let c = {
            threshold: rndTrinary(a.threshold, b.threshold, Math.random()),
            stability: rndTrinary(a.stability, b.stability, Math.random()),
            filter: rndTrinary(a.filter, b.filter, Math.random()),
            connections: []
        }

        /**
         * Iterate through whichever list of connections is bigger, a or b.
         * This way, we'll be able to sequence every connection.
         */
        for (let i = 0; i < Math.max(a.connections.length, b.connections.length); i++) {
            /**
             * Get the connections at this index in both neurons. This may be undefined in up to one neuron.
             * @type {Connection} conA
             * @type {Connection} conB
             */
            let conA = a.connections[i];
            let conB = b.connections[i];

            /**
             * If there is a connection element at this index for both a and b,
             *      there is a 49% chance (each) of pushing conA or conB.
             *      And a 2% chance of crossing.
             */
            if (conA && conB) {

                /**
                 * 99.5% chance of pushing either connection A, B, or a mutant thereof.
                 */
                if (Math.random() < 0.995) {
                    c.connections.push(rndTrinary(conA, conB, Neuron.crossConnections(conA, conB)));
                } else {
                    /**
                     * .5% chance of pushing both connections A and B.
                     */
                    c.connections.push(conA, conB)
                }
            } else if (rndBool()) {
                /**
                 * If connections A and B don't both exist, 50% chance of pushing the existing one.
                 */
                c.connections.push(conA || conB);
            }
        }
        return new Neuron(c);
    }

    /**
     *
     * @param {Connection} conA
     * @param {Connection} conB
     * @return {Connection}
     */
    static crossConnections(conA, conB) {
        return ({
            offset: rndTrinary(conA.offset, conB.offset, Math.random() * 10 - Math.random() * 10),
            filter: rndTrinary(conA.filter, conB.filter, Math.random()),
            probability: rndTrinary(conA.probability, conB.probability, Math.random())
        });
    }
}

export default Neuron;