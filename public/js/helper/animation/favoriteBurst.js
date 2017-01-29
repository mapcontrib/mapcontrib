
import mojs from 'mo-js';


export default class FavoriteBurst {
    static init(parentElement, childSelector) {
        const scaleCurve = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0');
        const iconElement = parentElement.querySelector(childSelector);
        const timeline = new mojs.Timeline();

        // burst animation
        const tween1 = new mojs.Burst({
            parent: parentElement,
            children: {
                fill: '#fce94f',
                opacity: 0.6,
                radius: 15,
                duration: 1700,
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
            },
            radius: { 40: 120 },
            count: 6,
            isSwirl: true,
        });

        // ring animation
        const tween2 = new mojs.Transit({
            parent: parentElement,
            duration: 750,
            type: 'circle',
            radius: { 0: 50 },
            fill: 'transparent',
            stroke: '#fce94f',
            strokeWidth: { 15: 0 },
            opacity: 0.6,
            easing: mojs.easing.bezier(0, 1, 0.5, 1),
        });

        // icon scale animation
        const tween3 = new mojs.Tween({
            duration: 900,
            onFirstUpdate: () => {
                iconElement.classList.toggle('fa-star');
                iconElement.classList.toggle('fa-star-o');
            },
            onUpdate: (progress) => {
                const scaleProgress = scaleCurve(progress);
                iconElement.style.WebkitTransform = iconElement.style.transform = `scale3d(${scaleProgress}, ${scaleProgress}, 1)`;
            },
        });

        timeline.add(tween1, tween2, tween3);

        return timeline;
    }
}
