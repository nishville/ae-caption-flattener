(function () {
    app.beginUndoGroup("Extract text from precomps (safe)");

    var target = app.project.activeItem;
    if (!(target && target instanceof CompItem)) {
        alert(
            "Open the comp that contains the caption precomps and make it active."
        );
        app.endUndoGroup();
        return;
    }

    function hasTextProps(layer) {
        try {
            return (
                layer &&
                layer.property &&
                layer.property("ADBE Text Properties") !== null
            );
        } catch (e) {
            return false;
        }
    }

    // Collect precomp layers in the active comp
    var precompLayers = [];
    for (var i = 1; i <= target.numLayers; i++) {
        var lyr = target.layer(i);
        if (!lyr) continue;
        if (
            lyr instanceof AVLayer &&
            lyr.source &&
            lyr.source instanceof CompItem
        ) {
            precompLayers.push(lyr);
        }
    }

    if (precompLayers.length === 0) {
        alert("No precomp layers found in the active comp.");
        app.endUndoGroup();
        return;
    }

    // Sort by time so results make sense
    precompLayers.sort(function (a, b) {
        return (a.inPoint || 0) - (b.inPoint || 0);
    });

    var created = 0;
    var skippedPrecomps = 0;

    // Process from last to first to avoid any indexing weirdness
    for (var p = precompLayers.length - 1; p >= 0; p--) {
        var preLayer = precompLayers[p];
        if (
            !preLayer ||
            !preLayer.source ||
            !(preLayer.source instanceof CompItem)
        ) {
            skippedPrecomps++;
            continue;
        }

        var srcComp = preLayer.source;

        // This is the key offset that makes it match your manual paste behavior
        var offset =
            typeof preLayer.startTime === "number" ? preLayer.startTime : 0;

        var madeFromThis = 0;

        for (var s = srcComp.numLayers; s >= 1; s--) {
            var srcLayer = srcComp.layer(s);
            if (!hasTextProps(srcLayer)) continue;

            var newLayer;
            try {
                newLayer = srcLayer.copyToComp(target);
            } catch (e0) {
                newLayer = null;
            }
            if (!newLayer) continue;

            // Timing shift into main comp
            try {
                newLayer.startTime = (srcLayer.startTime || 0) + offset;
                newLayer.inPoint = (srcLayer.inPoint || 0) + offset;
                newLayer.outPoint = (srcLayer.outPoint || 0) + offset;
            } catch (e1) {}

            // Clamp to the visible window of the precomp layer in the main comp
            try {
                if (
                    typeof preLayer.inPoint === "number" &&
                    newLayer.inPoint < preLayer.inPoint
                ) {
                    newLayer.inPoint = preLayer.inPoint;
                }
                if (
                    typeof preLayer.outPoint === "number" &&
                    newLayer.outPoint > preLayer.outPoint
                ) {
                    newLayer.outPoint = preLayer.outPoint;
                }
            } catch (e2) {}

            // Name it so you can trace it back
            try {
                newLayer.name = preLayer.name;
            } catch (e3) {}

            created++;
            madeFromThis++;
        }

        if (madeFromThis === 0) skippedPrecomps++;
    }

    app.endUndoGroup();

    alert(
        "Done.\n" +
            "Text layers created: " +
            created +
            "\n" +
            "Precomp layers skipped (no usable text): " +
            skippedPrecomps
    );
})();
