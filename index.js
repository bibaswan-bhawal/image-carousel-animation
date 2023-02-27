const track = document.getElementById('image-track');
const images = document.getElementsByClassName('image');

const trackWidth = track.offsetWidth;
const imageWidth = trackWidth / images.length;

const maxScrollPercentage = -((track.offsetWidth - vmin(36)) / track.offsetWidth) * 100;

for (var i = 0; i < images.length; i++) {
    const imageOffset = -(imageWidth * i / trackWidth) * 100;
    const imageMovedPercentage = (0 - imageOffset) / 100;

    images[i].style.objectPosition = `${50 + imageMovedPercentage * 100}% 50%`;
}


function vmin(percent) {
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const vh = (percent * h) / 100;
    const vw = (percent * w) / 100;

    return Math.min(vh, vw);
}

const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
}

const handleOnMove = (e) => {
    if (track.dataset.mouseDownAt == "0") return;
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
    const maxDelta = window.innerWidth / 2;
    const percentage = (mouseDelta / maxDelta) * -100;
    const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), maxScrollPercentage);

    track.dataset.percentage = nextPercentage;

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards", easing: "ease-out" });

    for (var i = 0; i < images.length; i++) {
        const imageOffset = -(imageWidth * i / trackWidth) * 100;
        const imageMovedPercentage = (nextPercentage - imageOffset) / 100;

        images[i].animate({
            objectPosition: `${50 + imageMovedPercentage * 100}% center`
        }, { duration: 1200, fill: "forwards", easing: "ease-out" });

    }
}

const handleOnScroll = (e) => {
    var mouseDelta = 0;

    const max = Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY));

    if (max == Math.abs(e.deltaX)) {
        mouseDelta = e.deltaX;
    } else {
        mouseDelta = e.deltaY;
    }

    const maxDelta = trackWidth;
    const percentage = (mouseDelta / maxDelta) * -35;
    const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), maxScrollPercentage);

    track.dataset.prevPercentage = nextPercentage;

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 700, fill: "forwards", easing: "ease-out" });

    for (var i = 0; i < images.length; i++) {
        const imageOffset = -(imageWidth * i / trackWidth) * 100;
        const imageMovedPercentage = (nextPercentage - imageOffset) / 100;

        images[i].animate({
            objectPosition: `${50 + imageMovedPercentage * 100}% center`
        }, { duration: 700, fill: "forwards", easing: "ease-out" })
    }
}


window.addEventListener('wheel', handleOnScroll);

window.onmousedown = e => handleOnDown(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = e => handleOnUp(e);

window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);