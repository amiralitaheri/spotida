export default async ({canvas, type, images, options}) => {
    switch (type) {
        case 'photo':
            await photos(images, canvas, options);
            break;
        default:
            await circle(images, canvas, options);
    }
}

const toRad = (x) => x * (Math.PI / 180);

const SCALE = 1.5;

const photos = async (images, canvas, options = {}) => {
    const {scale = SCALE, font = 'bold 48px Indie Flower', backgroundColor = "#FFFFFF", title = ""} = options;
    await document.fonts.load(font);

    images = images.slice(0, 20);
    const photoWidth = 200 * scale;
    const photoHeight = 300 * scale;
    const paddingWidth = 200 * scale;
    const paddingHeight = 200 * scale;
    const gap = 10 * scale;
    const indent = 10 * scale;

    const gridSize = Math.ceil(Math.sqrt(images.length));
    const width = gridSize * photoWidth + 2 * paddingWidth;
    const height = Math.ceil(images.length / gridSize) * photoHeight + 2 * paddingHeight;


    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // fill the background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    addWatermark(ctx);
    ctx.font = font;
    ctx.textAlign = 'center'
    ctx.fillText(title, width / 2, 100, width);
    ctx.textAlign = 'start'

    let counter = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (counter === images.length) break;
            ctx.save();
            const x = j * (photoWidth + gap) + paddingWidth;
            const y = i * (photoHeight + gap) + paddingHeight;
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(x + 2, y + 2, photoWidth, photoHeight);
            ctx.fillStyle = '#F5F6FA';
            ctx.fillRect(x, y, photoWidth, photoHeight);
            const defaultAvatarUrl =
                "https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png";
            const avatarUrl = images[counter].url || defaultAvatarUrl;

            const img = await new Promise(((resolve, reject) => {
                let img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = avatarUrl;
                img.crossOrigin = 'Anonymous';
            }));

            ctx.drawImage(
                img,
                x + indent,
                y + indent,
                photoWidth - 2 * indent,
                photoWidth - 2 * indent
            );

            ctx.fillStyle = "#555555";
            ctx.font = font;
            // ctx.textAlign = 'center'
            ctx.fillText(`#${counter + 1} ${images[counter++].name}`, x + indent, y + indent + photoHeight * 4 / 5, photoWidth - 2 * indent);
            ctx.restore();
        }
    }


}

const circle = async (images, canvas, options = {}) => {
    const {backgroundColor = "#FFFFFF"} = options

    const circlesRadius = 100;
    const imageRadius = 50;
    const padding = 100;
    const offset_conf = 0;


    let layers = [1];
    let count = 1;

    while (count < images.length) {
        let c = Math.floor(layers.length * circlesRadius * 3.14 / imageRadius);
        layers.push(c);
        count += c;
    }

    const width = 2 * layers.length * circlesRadius + padding;
    const height = 2 * layers.length * circlesRadius + padding;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // fill the background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    addWatermark(ctx);


    let counter = 0;
    // loop over the layers
    for (let count of layers) {
        let layerIndex = layers.indexOf(count);
        count = Math.min(count, images.length - counter);
        const angleSize = 360 / count;

        // loop over each circle of the layer
        for (let i = 0; i < count; i++) {
            // We need an offset or the first circle will always on the same line and it looks weird
            // Try removing this to see what happens
            const offset = layerIndex * offset_conf;

            // i * angleSize is the angle at which our circle goes
            // We need to converting to radiant to work with the cos/sin
            const r = toRad(i * angleSize + offset);

            const centerX = Math.cos(r) * layerIndex * circlesRadius + width / 2;
            const centerY = Math.sin(r) * layerIndex * circlesRadius + height / 2;

            // if we are trying to render a circle but we ran out of users, just exit the loop. We are done.
            if (counter === images.length) break;

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, imageRadius - 2, 0, 2 * Math.PI);
            ctx.clip();

            const defaultAvatarUrl =
                "https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png";
            const avatarUrl = images[counter++].url || defaultAvatarUrl;

            const img = await new Promise(((resolve, reject) => {
                let img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.crossOrigin = 'Anonymous';
                img.src = avatarUrl;
            }));

            ctx.drawImage(
                img,
                centerX - imageRadius,
                centerY - imageRadius,
                imageRadius * 2,
                imageRadius * 2
            );

            ctx.restore();
        }
    }
}

const addWatermark = ctx => {
    ctx.fillStyle = "#555555";
    ctx.font = '48px serif';
    ctx.textAlign = 'end';
    ctx.fillText('spotida.ir', ctx.canvas.width - 25, ctx.canvas.height - 25, 900);
}