/**
 * PlainBlack Blog Image Injector
 * Drop this file at: assets/js/blog-images.js
 * Add to every blog post: <script src="../../assets/js/blog-images.js"></script>
 *
 * To add images to a post: add an entry to the map below.
 * Key = URL slug (the filename without .html)
 * Value = array of image objects in order of appearance on the page
 */

(function () {
  var BASE = '../../assets/blog/';

  var IMAGE_MAP = {
    'ai-chatbots-transforming-business': [
      { src: 'ai-chatbots-transforming-business-1.webp', alt: 'AI chatbots transforming business operations in 2026' }
    ],
    'dont-lose-them-at-404': [
      { src: 'dont-lose-them-at-404-1.webp', alt: 'Custom 404 error page turning a dead end into brand engagement' }
    ],
    'most-people-are-dumb-fucks': [
      { src: 'most-people-are-dumb-fucks-1.webp', alt: 'National Achievers Congress Auckland event' },
      { src: 'most-people-are-dumb-fucks-2.webp', alt: 'Graeme Holm presenting at National Achievers Congress' },
      { src: 'most-people-are-dumb-fucks-3.webp', alt: 'Elena Cardone speaking at National Achievers Congress' },
      { src: 'most-people-are-dumb-fucks-4.webp', alt: 'Adam Hudson presenting at National Achievers Congress' }
    ],
    'paywalled-and-forgotten': [
      { src: 'paywalled-and-forgotten-1.webp', alt: 'Newspapers behind paywalls losing readers to free digital alternatives' }
    ],
    'perceived-value-and-the-art-of-sales': [
      { src: 'perceived-value-and-the-art-of-sales-1.webp', alt: 'National Achievers Congress Auckland 2019' },
      { src: 'perceived-value-and-the-art-of-sales-2.webp', alt: 'David Leon presenting at National Achievers Congress' },
      { src: 'perceived-value-and-the-art-of-sales-3.webp', alt: 'Grant Cardone speaking at National Achievers Congress Auckland' },
      { src: 'perceived-value-and-the-art-of-sales-4.webp', alt: 'PlainBlack team at National Achievers Congress lunch break' }
    ],
    'the-font-fiasco': [
      { src: 'the-font-fiasco-1.webp', alt: 'Typography and font choices in brand logo design' },
      { src: 'the-font-fiasco-2.webp', alt: 'Good versus bad font pairing examples in brand identity' }
    ],
    'the-human-touch': [
      { src: 'the-human-touch-1.webp', alt: 'Human connection in digital marketing beyond algorithms and automation' }
    ],
    'wear-your-heart-on-your-sleeve': [
      { src: 'wear-your-heart-on-your-sleeve.webp', alt: 'Benjamin Lloyd artist Tauranga New Zealand' }
    ],
    'what-tool-can-teach-you-about-marketing': [
      { src: 'what-tool-can-teach-you-about-marketing-1.webp', alt: 'TOOL performing live at Rod Laver Arena Melbourne 2020' },
      { src: 'what-tool-can-teach-you-about-marketing-2.webp', alt: 'TOOL concert crowd at Rod Laver Arena' }
    ],
    'worst-sales-promotion-in-history': [
      { src: 'worst-sales-promotion-in-history-1.gif',  alt: 'Hoover free flights promotion advertisement 1992' },
      { src: 'worst-sales-promotion-in-history-2.webp', alt: 'Hoover showroom in the 1920s' },
      { src: 'worst-sales-promotion-in-history-3.webp', alt: 'Hoover free flights newspaper advertisement The Guardian October 1992' },
      { src: 'worst-sales-promotion-in-history-4.webp', alt: 'Hoover free flights TV commercial still 1992' },
      { src: 'worst-sales-promotion-in-history-5.webp', alt: 'Hoover free flights redemption process diagram showing obstacles for customers' },
      { src: 'worst-sales-promotion-in-history-6.webp', alt: 'Hoover scandal newspaper headlines from The Guardian and The Observer 1992 to 1996' }
    ],
    'you-never-get-a-second-chance': [
      { src: 'you-never-get-a-second-chance-1.webp', alt: 'Inspire and Succeed Conference Brisbane 2019' },
      { src: 'you-never-get-a-second-chance-2.webp', alt: 'Michael Crossland speaking at Inspire and Succeed Conference Brisbane' },
      { src: 'you-never-get-a-second-chance-3.webp', alt: 'Lisa Messenger presenting at Inspire and Succeed Conference Brisbane' },
      { src: 'you-never-get-a-second-chance-4.webp', alt: 'Sir Richard Branson at Inspire and Succeed Conference Brisbane 2019' }
    ],
    'fear-sells-until-it-doesnt': [
    { src: 'fear-sells-until-it-doesnt-1.jpg', alt: 'Person staring at laptop screen in the dark, face lit by anxious blue glow' }
    ],
    'ian-has-gone-off-the-deep-end': [
    { src: 'ian-has-gone-off-the-deep-end-1.webp', alt: 'Utopian Australian city with multigenerational community enjoying public spaces and financial freedom' }
    ],
    'your-website-is-solving-the-wrong-problem': [
    { src: 'your-website-is-solving-the-wrong-problem-1.jpg', alt: 'Small business owner frustrated with a website that looks good but does not convert' }
    ],
  };

  // Get the current page slug from the URL
  var path = window.location.pathname;
  var slug = path.split('/').pop().replace('.html', '');

  var images = IMAGE_MAP[slug];
  if (!images || !images.length) return;

  // Find all placeholder image containers on the page
  var placeholders = document.querySelectorAll('.post-image');
  if (!placeholders.length) return;

  images.forEach(function (imgData, i) {
    if (!placeholders[i]) return;
    var placeholder = placeholders[i];

    // Build the img element
    var img = document.createElement('img');
    img.src = BASE + imgData.src;
    img.alt = imgData.alt;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit';

    // Swap placeholder content for the image
    placeholder.innerHTML = '';
    placeholder.style.padding = '0';
    placeholder.style.background = 'none';
    placeholder.appendChild(img);

    // If there's a caption, add it
    if (imgData.caption) {
      var cap = document.createElement('p');
      cap.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:rgba(14,26,20,0.7);color:rgba(255,255,255,0.6);font-size:0.72rem;padding:6px 14px;margin:0;border-radius:0 0 var(--radius,16px) var(--radius,16px)';
      cap.textContent = imgData.caption;
      placeholder.style.position = 'relative';
      placeholder.appendChild(cap);
    }
  });
})();
