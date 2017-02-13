
import mojs from 'mo-js';


export default class OsmFirework {
    static init(element) {
        const timeline = new mojs.Timeline();

        const burst1 = new mojs.Burst({
            parent: element,
            count: 6,
            left: '0%',
            top: '-50%',
            radius: { 0: 60 },
            children: {
                fill: [ '#988ADE', '#DE8AA0', '#8AAEDE', '#8ADEAD', '#DEC58A', '#8AD1DE' ],
                duration: 1300,
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
            },
        });

        const burst2 = new mojs.Burst({
            parent: element,
            left: '-100%',
            top: '-20%',
            count: 14,
            radius: { 0: 120 },
            children: {
                fill: [ '#988ADE', '#DE8AA0', '#8AAEDE', '#8ADEAD', '#DEC58A', '#8AD1DE' ],
                duration: 1600,
                delay: 100,
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
            },
        });

        const burst3 = new mojs.Burst({
            parent: element,
            left: '130%',
            top: '-70%',
            count: 14,
            radius: { 0: 90 },
            children: {
                fill: [ '#988ADE', '#DE8AA0', '#8AAEDE', '#8ADEAD', '#DEC58A', '#8AD1DE' ],
                duration: 2000,
                delay: 200,
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
            },
        });

        const burst4 = new mojs.Burst({
            parent: element,
            left: '-20%',
            top: '-100%',
            count: 14,
            radius: { 0: 60 },
            children: {
                fill: [ '#988ADE', '#DE8AA0', '#8AAEDE', '#8ADEAD', '#DEC58A', '#8AD1DE' ],
                duration: 2000,
                delay: 300,
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
            },
        });

        const burst5 = new mojs.Burst({
            parent: element,
            count: 12,
            left: '30%',
            top: '-80%',
            radius: { 0: 60 },
            children: {
                fill: [ '#988ADE', '#DE8AA0', '#8AAEDE', '#8ADEAD', '#DEC58A', '#8AD1DE' ],
                duration: 1400,
                delay: 400,
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
            },
        });

        timeline.add(burst1, burst2, burst3, burst4, burst5);

        return timeline;
    }
}
