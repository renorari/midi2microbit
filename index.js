const fs = require("node:fs");
const { parseMidi } = require("midi-file");

function noteNumToHz(noteNum) {
    return Math.floor(440 * Math.pow(2, (noteNum - 69) / 12));
}

const midi = [];
var deltaTime = 0;

fs.writeFileSync("a.txt", JSON.stringify(parseMidi(fs.readFileSync("test4.mid")), null, 4));

parseMidi(fs.readFileSync("test.mid")).tracks/*.forEach((track) => {*/
    // eslint-disable-next-line no-unexpected-multiline
    /*track*/[2].forEach((event) => {
        deltaTime += event.deltaTime;
        if (event.type === "setTempo") {
            midi.push(`music.setTempo(${Math.floor(60000000 / event.microsecondsPerBeat)});`);
        } else if (event.type === "timeSignature") {
        /*midi.push(`music.setTimeSignature(${event.numerator}, ${event.denominator});`);*/
        } else if (event.type === "endOfTrack") {
            midi.push("music.rest(music.beat(1));");
        } else if (event.type === "programChange") {
        /*midi.push(`music.setInstrument(${event.programNumber});`);*/
        } else if (event.type === "noteOn") {
            if (deltaTime) {
                midi.push(`music.rest(${deltaTime});\nmusic.ringTone(${noteNumToHz(event.noteNumber)});`);
                deltaTime = 0;
            } else {
                midi.push(`music.ringTone(${noteNumToHz(event.noteNumber)});`);
                deltaTime = 0;
            }
        } else if (event.type === "noteOff") {
            midi.push(`basic.pause(${deltaTime});`);
            deltaTime = 0;

        } else if (event.type === "controller") {
            if (event.controllerType === 7) {
                midi.push(`music.setVolume(${event.value});`);
            }
        }
    });
/*});*/

fs.writeFileSync("test.txt", midi.join("\n"));