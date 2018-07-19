import Neuron, {Types} from './Neuron';
import {rndBool, rndTrinary} from "./evoHelpers";

export class Brain{

    constructor({neurons = []}){
        /**
         * @type {Neuron[]} neurons
         * @type {Neuron[]} inputs
         * @type {Neuron[]} outputs
         */
        this.neurons = neurons;
        this.inputs = [];
        this.outputs = [];
        this.parseIO();
    }

    /**
     * Iterate through neurons,
     * push inputs and output into their buffers.
     */
    parseIO(){
        this.neurons.forEach(n => {
            switch(n.type){
                case Types.INPUT:
                    this.inputs.push(n)
                    break;
                case Types.OUTPUT:
                    this.outputs.push(n)
                    break;
            }
        })
    }

    /**
     * Breed two brains to return a third brain.
     * @param {Brain} a
     * @param {Brain} b
     * @return {Brain}
     */
    static cross(a, b){
        const c = {
            neurons: []
        };
        for(let i = 0; i < Math.max(a.neurons.length, b.neurons.length); i++){
            /**
             * Get the neuron at this index for both neurons.
             * This may be undefined for one neuron.
             * @type {Neuron} nA
             * @type {Neuron} nB
             */
            const nA = a.neurons[i];
            const nB = b.neurons[i];

            if(nA && nB){
                if(Math.random() < 0.995){
                    c.neurons.push(rndTrinary(nA, nB, Neuron.cross(nA, nB)));
                }else{
                    c.neurons.push(nA, nB);
                }
            }else if(rndBool()){
                c.neurons.push(nA || nB);
            }
        }
        return new Brain(c);
    }
}