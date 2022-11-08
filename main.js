// Returns a random DNA base
const returnRandBase = () => {
    const dnaBases = ['A', 'T', 'C', 'G'];
    return dnaBases[Math.floor(Math.random() * 4)]; 
};
  
// Returns a random single stand of DNA containing 15 bases
const mockUpStrand = () => {
    const newStrand = [];
    for (let i = 0; i < 15; i++) {
      newStrand.push(returnRandBase());
    };
    return newStrand;
};

//  Factory function of a P. aequor
const pAequorFactory = (specimenNum, dna) => {
    return {
        specimenNum,
        dna,
        mutate() {
            let basePosition = Math.floor(Math.random() * this.dna.length);
            //console.log(basePosition)
            let base = this.dna[basePosition];
            let randomBase = returnRandBase();
            //console.log(base, randomBase);
            if (randomBase === base) {
                this.mutate();
            } else {
                let mutatedDNA = this.dna;
                mutatedDNA.splice(basePosition, 1, randomBase);
                //console.log(mutatedDNA);
                this.dna = mutatedDNA;
            }
        },
        compareDNA(pAequor) {
            let thisDNA = this.dna;
            let thatDNA = pAequor.dna;
            let sameDNApair = 0;
            for (let i = 0; i < thisDNA.length; i++) {
                if (thisDNA[i] === thatDNA[i]) {
                    sameDNApair++;
                };
            };
            let commonDNA = sameDNApair / this.dna.length;
            return commonDNA;
        },
        messageCompareDNA(pAequor) {
            console.log(`Specimen ${this.specimenNum} and specimen ${pAequor.specimenNum} have ${this.compareDNA(pAequor) * 100}% DNA in common.`); // separate function to avoid excessive control.log() messaging while finding the closest relative
        },
        willLikelySurvive() {
            let thisDNA = this.dna;
            let cgPairs = thisDNA.filter(pair => pair === 'C' || pair === 'G');
            if (cgPairs.length / thisDNA.length >= 0.6) {
                return true;
            } else {
                return false;
            };
        },
        complementStrand() {
            let originalDNA = dna;
            let complementDNA = originalDNA.map(base => {
                switch (base) {
                    case 'A':
                        return 'T';
                        break;
                    case 'T':
                        return 'A';
                        return;
                    case 'C':
                        return 'G';
                        break;
                    case 'G':
                        return 'C';
                        break;
                    default:
                        console.log('Error!')
                }; 
            });
            this.complementDNA = complementDNA;
        }
    };
};

const specimens = []; // this is where the newly created specimens will be stored
const createSpecimensLikelyToSurvive = (sizeOfSample) => {
    let tempSpecNum = 0;
    while (specimens.length < sizeOfSample) {
        let tempSpecDNA = mockUpStrand();
        let tempSpec = pAequorFactory(tempSpecNum, tempSpecDNA);
        if (tempSpec.willLikelySurvive()) {
            tempSpec.specimenNum = specimens.length + 1;
            specimens.push(tempSpec);
        };
    };
};

createSpecimensLikelyToSurvive(30);
console.log(specimens); // lists the specimens likely to survive

const findClosestRelatives = () => {
    let relationArr = [];
    specimens.forEach((spec, index) => {
        for (let i = index + 1; i < specimens.length; i++) {
            let comparison = spec.compareDNA(specimens[i]);
            if (relationArr.length === 0) {
                relationArr.push(index, i, comparison);
            } else if (comparison > relationArr[2]) {
                relationArr.splice(0, 3, index, i, comparison);
            }
        };    
    });
    console.log(`The closest relatives have been identified.`);
    specimens[relationArr[0]].messageCompareDNA(specimens[relationArr[1]]);
};

findClosestRelatives();

const mutateARandomSpecimenAndGiveItDoubleDNA = () =>{
    let randomDoubleStrandIndex = Math.floor(Math.random() * specimens.length);
    console.log(specimens[randomDoubleStrandIndex]);
    specimens[randomDoubleStrandIndex].mutate();
    specimens[randomDoubleStrandIndex].complementStrand();
    console.log(specimens[randomDoubleStrandIndex]);
};

mutateARandomSpecimenAndGiveItDoubleDNA();
