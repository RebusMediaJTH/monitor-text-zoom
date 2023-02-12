const demo = bootstrapVersion => {
    monitorTextZoom.init({
        notifyLevelOnInit: false,
        remSize: bootstrapVersion === 3 ? 10 : 16,
        attachZoomLevels: [110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 250, 300, 350, 400, 450, 500],
        bootstrap: bootstrapVersion,
        changed: e => {
            console.log("changed", e.factor, e.percentage);
            document.getElementById("zoom-level").innerHTML = `${e.percentage}%`;
        }
    });
    document.getElementById("zoom-level").innerHTML = `${monitorTextZoom.getZoom().percentage}%`;
    document.addEventListener("textzoom", e => {
        e = e.detail;
        console.log("textzoom", e.factor, e.percentage);
    });
};
