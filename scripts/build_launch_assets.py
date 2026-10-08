from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"
SOURCE = Path(sys.argv[1])


def fit_cover(image, size):
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def brand_font(name, size):
    return ImageFont.truetype(str(ASSETS / name), size)


def build_social_banner():
    image = fit_cover(Image.open(SOURCE).convert("RGB"), (1200, 630))
    wash = Image.new("RGBA", image.size, (0, 0, 0, 0))
    pixels = wash.load()
    for x in range(image.width):
        strength = max(0, min(1, (720 - x) / 320))
        alpha = round(238 * strength)
        for y in range(image.height):
            pixels[x, y] = (255, 255, 255, alpha)
    image = Image.alpha_composite(image.convert("RGBA"), wash)
    draw = ImageDraw.Draw(image)

    logo = Image.open(ASSETS / "logo-raw-2.png").convert("RGBA")
    logo_pixels = logo.load()
    for y in range(logo.height):
        for x in range(logo.width):
            red, green, blue, alpha = logo_pixels[x, y]
            if not alpha:
                continue
            if y <= 107 and red > green * 1.5:
                logo_pixels[x, y] = (214, 5, 5, alpha)
            elif y >= 350:
                logo_pixels[x, y] = (112, 112, 112, alpha)
            else:
                logo_pixels[x, y] = (10, 10, 10, alpha)
    logo.thumbnail((132, 132), Image.Resampling.LANCZOS)
    logo_mark = logo
    image.alpha_composite(logo_mark, (62, 46))

    title_font = brand_font("faculty-glyphic-400.ttf", 56)
    body_font = brand_font("inter-tight-400.ttf", 25)
    small_font = brand_font("inter-tight-500.ttf", 20)
    burgundy = (76, 7, 7, 255)
    charcoal = (25, 22, 22, 255)
    muted = (92, 86, 86, 255)
    draw.rounded_rectangle((64, 198, 70, 400), radius=3, fill=burgundy)
    draw.multiline_text((92, 194), "Fast loans.\nNo collateral.\nNo wahala.", font=title_font, fill=charcoal, spacing=2)
    draw.text((66, 454), "For employees, traders and business owners.", font=body_font, fill=muted)
    draw.text((66, 530), "ioufinanceltd.com", font=small_font, fill=burgundy)

    image.convert("RGB").save(ASSETS / "iou-finance-social-banner.jpg", quality=91, optimize=True, progressive=True)


def build_icons():
    source = Image.open(ASSETS / "logo-raw-2.png").convert("RGBA")
    for size, name in ((64, "favicon.png"), (180, "apple-touch-icon.png")):
        background = Image.new("RGBA", (size, size), (76, 7, 7, 255))
        mark = source.copy()
        mark.thumbnail((round(size * 0.82), round(size * 0.82)), Image.Resampling.LANCZOS)
        background.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
        background.save(ASSETS / name, optimize=True)


def build_webp_assets():
    names = [
        "hero-home-executive-wide.png",
        "about-hero-executive-office.png",
        "faq-hero-advisor-office.png",
        "about-hero-woman-office.png",
        "contact-hero-women-meeting.png",
        "contact-hero-team-meeting.png",
        "about-our-mission.jpg",
        "about-what-we-stand-for.jpg",
        "benefit-same-day.jpg",
        "benefit-no-collateral.jpg",
        "benefit-transparent-terms.jpg",
        "process-apply.jpg",
        "process-approval.jpg",
        "process-funds.jpg",
        "process-eligibility.jpg",
        "service-emergency.png",
        "service-personal.png",
        "service-payday.png",
        "service-business.png",
        "service-group-loan.jpg",
        "service-lpo-financing.jpg",
        "service-asset-financing.jpg",
        "service-savings-investment.jpg",
    ]
    for name in names:
        source_path = ASSETS / name
        image = Image.open(source_path).convert("RGB")
        if max(image.size) > 2400:
            image.thumbnail((2400, 2400), Image.Resampling.LANCZOS)
        image.save(source_path.with_suffix(".webp"), "WEBP", quality=84, method=6)


if __name__ == "__main__":
    build_social_banner()
    build_icons()
    build_webp_assets()
