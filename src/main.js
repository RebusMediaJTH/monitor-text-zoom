import "./main.scss";

let iframe, remSize, attachZoomLevels, bootstrap, changedHandler;

const zoom = {factor: undefined, percentage: undefined};

const getZoom = () => Object.assign({}, zoom);

export default {
    init: options => {
        remSize = options.remSize;
        attachZoomLevels = options.attachZoomLevels;
        bootstrap = options.bootstrap;
        changedHandler = options.changed;
        prepareBootstrapStackNodes();
        iframe = document.createElement("IFRAME");
        iframe.setAttribute("aria-hidden", "true");
        iframe.setAttribute("tabindex", "-1");
        iframe.setAttribute("title", "Text zoom monitor iframe");
        document.body.insertBefore(iframe, document.body.firstChild);
        const ifs = iframe.style;
        ifs.width = "1rem";
        ifs.height = "1px";
        ifs.borderWidth = 0;
        ifs.position = "absolute";
        ifs.overflow = "hidden";
        ifs.whiteSpace = "nowrap";
        ifs.margin = "-1px";
        const s = 'style="width:100%;height:100%;padding:0;margin:0;overflow:hidden;"';
        let doc = iframe.contentWindow || iframe.contentDocument || iframe.document;
        doc = doc.document || doc;
        doc.open();
        doc.write("<!DOCTYPE html><html " + s + "><body " + s + "></body></html>");
        doc.close();
        setResizeFactor();
        if (options.notifyLevelOnInit) {
            iframe.contentWindow.addEventListener("resize", onFontSizeChanged);
        } else {
            window.setTimeout(() => iframe.contentWindow.addEventListener("resize", onFontSizeChanged), 0);
        }
    },
    getZoom: getZoom,
    requery: () => {
        prepareBootstrapStackNodes();
        processQueries();
    }
};

const checkSingleQuery = (query, tz) => {
    const test = query.split(":"),
        check = test[0].trim(),
        size = Number(test[1]);
    return (
        (check === "lt" && tz < size) ||
        (check === "lte" && tz <= size) ||
        (check === "gt" && tz > size) ||
        (check === "gte" && tz >= size) ||
        (check === "eq" && tz === size)
    );
};

const checkANDs = (query, tz) => {
    let res;
    const parts = query.split("+");
    for (let i = 0; i < parts.length; i++) {
        res = checkSingleQuery(parts[i], tz);
        if (!res) {
            break;
        }
    }
    return res;
};

const checkORs = (query, tz) => {
    const queries = query.split("|");
    for (let i = 0; i < queries.length; i++) {
        if (checkANDs(queries[i], tz)) {
            return true;
        }
    }
};

const processQueries = () => {
    const regex = /\[.*?\]/;
    document.querySelectorAll("[data-query-tz]").forEach(function (node) {
        const queries = node.dataset.queryTz.split(" ");
        for (let i = 0; i < queries.length; i++) {
            let part = queries[i].trim();
            if (!part.length) {
                continue;
            }
            let cls = "tz-query-match";
            const matched = regex.exec(part);
            if (matched) {
                cls = matched[0];
                part = part.replace(cls, "");
                cls = cls.substring(1, cls.length - 1);
            }
            if (checkORs(part, zoom.percentage)) {
                node.classList.add(cls);
            } else {
                node.classList.remove(cls);
            }
        }
    });
};

const setResizeFactor = () => {
    // Don't use offsetWidth as it's rounded, at least in FF
    zoom.factor = iframe.getBoundingClientRect().width / remSize;
    zoom.percentage = Math.round((zoom.factor || 1) * 100);
    attachZoomLevelClasses();
    processQueries();
};

const onFontSizeChanged = () => {
    setResizeFactor();
    const tz = getZoom();
    if (changedHandler) {
        changedHandler(tz);
    }
    document.dispatchEvent(
        new CustomEvent("textzoom", {
            detail: tz
        })
    );
    return false;
};

/*
    Convert:
    .stack-tz-{percentage}
    To:
    .stack-tz-if data-query-tz="gte:{percentage}[bs{version}-tz-query-match]"
*/
const prepareBootstrapStackNodes = () => {
    if (!bootstrap) {
        return;
    }
    document.querySelectorAll(":not(.stack-tz-if)[class*='stack-tz-']").forEach(function (node) {
        const parts = node
                .getAttribute("class")
                .split(" ")
                .filter(function (part) {
                    return part.trim().indexOf("stack-tz-") === 0;
                })[0]
                .split("-"),
            breakpoint = parts[parts.length - 1];
        node.classList.add("stack-tz-if");
        node.setAttribute("data-query-tz", `gte:${breakpoint}[bs${Math.min(5, bootstrap)}-tz-query-match]`);
    });
};

const attachZoomLevelClasses = () => {
    if (!attachZoomLevels || !attachZoomLevels.length) {
        return;
    }
    for (let i = 0; i < attachZoomLevels.length; i++) {
        const cls = "tz-" + attachZoomLevels[i];
        if (zoom.percentage >= attachZoomLevels[i]) {
            document.body.classList.add(cls);
        } else {
            document.body.classList.remove(cls);
        }
    }
};
