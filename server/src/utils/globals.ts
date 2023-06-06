interface IGlobals {
    getRefCodeFromId: (id: number) => number,
    getIdFromRefCode: (id: number) => number,
}

const referalbase = 25000

const globals: IGlobals = {
    getRefCodeFromId(id) {
        return id + referalbase
    },
    getIdFromRefCode(refcode){
        return refcode - referalbase
    }
}

export default globals