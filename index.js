const track = document.getElementById('image-track');
const images = document.getElementsByClassName('image');

const trackWidth = track.offsetWidth;
const imageWidth = trackWidth / images.length;

for (var i = 0; i < images.length; i++) {
    const imageOffset = -(imageWidth * i / trackWidth) * 100;
    const imageMovedPercentage = (0 - imageOffset) / 100;

    images[i].style.objectPosition = `${50 + imageMovedPercentage * 100}% 50%`;
}

window.onmousedown = e => track.dataset.mouseDownAt = e.clientX;

function vmin(percent) {
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const vh = (percent * h) / 100;
    const vw = (percent * w) / 100;

    return Math.min(vh, vw);
}

window.onmouseup = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
}

window.onmousemove = (e) => {
    if (track.dataset.mouseDownAt == "0") return;
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX
    const maxDelta = window.innerWidth / 2;
    const percentage = (mouseDelta / maxDelta) * -100;
    const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -((track.offsetWidth - vmin(40)) / track.offsetWidth) * 100);

    track.dataset.percentage = nextPercentage;

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1500, fill: "forwards", easing: "ease-in-out" });

    for (var i = 0; i < images.length; i++) {
        const imageOffset = -(imageWidth * i / trackWidth) * 100;
        const imageMovedPercentage = (nextPercentage - imageOffset) / 100;

        images[i].animate({
            objectPosition: `${50 + imageMovedPercentage * 100}% center`
        }, { duration: 1500, fill: "forwards", easing: "ease-in-out" });

    }
}

const scrollContainer = document.querySelector('body');

scrollContainer.addEventListener('wheel', (e) => {
    var mouseDelta = 0;
    const max = Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY));

    if (max == Math.abs(e.deltaX)) {
        mouseDelta = e.deltaX;
    } else {
        mouseDelta = e.deltaY;
    }

    const maxDelta = trackWidth;
    const percentage = (mouseDelta / maxDelta) * -50;
    const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.dataset.prevPercentage = nextPercentage;

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 800, fill: "forwards", easing: "ease-in-out" });

    for (var i = 0; i < images.length; i++) {
        const imageOffset = -(imageWidth * i / trackWidth) * 100;
        const imageMovedPercentage = (nextPercentage - imageOffset) / 100;

        images[i].animate({
            objectPosition: `${50 + imageMovedPercentage * 100}% center`
        }, { duration: 800, fill: "forwards", easing: "ease-in-out" })
    }
});
