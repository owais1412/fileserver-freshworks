const assignment = require("../index");


const testMsg = () => {
    const val = assignment.printMsg("Owais");
    if(val == "Hey Owais") {
        console.log("PASSED");
    } else {
        console.log("FAILED");
    }
}
testMsg();