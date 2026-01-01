# ae-caption-flattener

Extracts text layers from Premiere-generated caption precomps and bakes them into a single After Effects comp with correct timing.

## Why this exists

When you:

1. Create captions in Premiere Pro
2. Convert captions to graphic layers
3. Send the sequence to After Effects

Premiere often creates **one precomp per caption line**. Each precomp usually contains a single text layer with the correct timing.

Manually, you can:

-   open each precomp,
-   select the text layer,
-   copy it,
-   paste it into the main comp,

and it lands at the correct time.  
That works, but it’s slow and repetitive.

This script automates that exact manual process.

## What the script does

Run the script with your **main comp active**.

It will:

-   Scan the active comp for **precomp layers** (layers whose source is a CompItem).
-   For each precomp layer:
    -   Find any layers inside the precomp that contain **Text Properties**.
    -   Copy those text layers into the active comp using `copyToComp()`, preserving:
        -   text content
        -   styling
        -   keyframes
    -   Offset timing so the pasted text appears exactly where the precomp plays in the main comp:
        -   `startTime`, `inPoint`, and `outPoint` are shifted by the precomp layer’s placement.
    -   Clamp the pasted text layer to the visible in/out range of the precomp layer in the main comp.

Result:

-   All captions become **real text layers** in one comp.
-   Timing matches what you see when copying and pasting manually.
-   You can now apply animation presets, adjust timing, or batch-edit captions easily.

## What it does NOT do

-   It does not delete or disable the original precomp layers.
-   It does not attempt to bake complex transformations such as:
    -   time remapping
    -   time stretch
    -   heavy transform manipulation on the precomp layer

This matches typical caption workflows, where precomp layers are left untouched.

## Requirements

-   Adobe After Effects
-   A comp containing Premiere-generated caption precomps

## Installation

1. Download the `.jsx` script.
2. In After Effects, run:
    - `File > Scripts > Run Script File...`
3. Optional:
    - Place the script in the After Effects Scripts folder for quick access.

## Usage

1. Open After Effects.
2. Open the **main comp** that contains the caption precomps.
3. Click inside the comp timeline to make it the active item.
4. Run the script.
5. Verify that text layers now exist directly in the main comp.
6. Apply your animation presets as needed.
7. Manually delete or disable the original precomp layers if desired.

## Notes

-   If a caption precomp contains multiple text layers, all of them will be copied.
-   Pasted text layers are named after their source precomp layer for easy tracing.

## License

Choose whatever license fits your needs. MIT is a common default for small utility scripts.
