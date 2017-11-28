/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.defaults("gpii.test.diff.testDefs.compareMarkdown", {
    gradeNames: ["fluid.component"],
    // We need to preserve `undefined` values in our comparisons.
    mergePolicy: {
        "testDefs.markdown": "nomerge, noexpand"
    },
    testDefs: {
        markdown: {
            htmlChangeWithinTags: {
                message:    "Changes within tags should be handled correctly...",
                leftValue:  "<b>This is bold</b>",
                rightValue: "<b>This is no less bold</b>",
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [{value: "This is", type: "unchanged"}, { value:  " no less", type: "added"}, { value: " bold", type: "unchanged"}]
            },
            htmlTagsChanged: {
                message:    "Changes to only HTML tags should not be reported as changes...",
                leftValue:  "<b>This is a fine sentence.</b>",
                rightValue: "<i>This is a fine sentence.</i>",
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [{value: "This is a fine sentence.", type: "unchanged"}]
            },
            htmlRemoved: {
                message:    "HTML tags that are removed should not be reported as changes...",
                leftValue:  "This is <b>bold</b>",
                rightValue: "This is bold",
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [{value: "This is bold", type: "unchanged"}]
            },
            htmlAdded: {
                message:    "HTML tags that are added should not be reported as changes...",
                leftValue:  "This is bold",
                rightValue: "This is <b>bold</b>",
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [{value: "This is bold", type: "unchanged"}]
            },
            markdownChangeWithinMarkdown: {
                message:    "Changes to the markdown but not the text should not be reported as changes...",
                leftValue:  "*emphasis*",
                rightValue: "_emphasis_",
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [{ value: "emphasis", type: "unchanged" }]
            },
            markdownChanged: {
                message:    "Text changes within Markdown should be reported correctly...",
                leftValue:  "**This is bold**",
                rightValue: "*This is italic*",
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [{ value: "This is ", type: "unchanged" }, {value: "bold", type: "removed" }, { value: "italic", type: "added" }]
            },
            markdownAdded: {
                message:    "Markdown that is added should not be reported as a change...",
                leftValue:  "This is strong.",
                rightValue: "This is *strong*.",
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [{ value: "This is strong.", type: "unchanged"}]
            },
            markdownRemoved: {
                message:    "Markdown that is removed should not be reported as a change...",
                leftValue:  "This is *strong*.",
                rightValue: "This is strong.",
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [{ value: "This is strong.", type: "unchanged"}]
            },
            nonStringLeft: {
                message:    "We should be able to handle non-strings on the left side of the comparison...",
                leftValue:  1,
                rightValue: "string value",
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [{ value: 1, type: "removed"}, { value: "string value", type: "added"}]
            },
            nonStringRight: {
                message:    "We should be able to handle non-strings on the left side of the comparison...",
                leftValue:  "string value",
                rightValue: 1,
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [{ value: "string value", type: "removed" }, { value: 1, type: "added" }]
            },
            bothNonStrings: {
                message:    "We should be able to handle non-strings on both sides of the comparison...",
                leftValue:  true,
                rightValue: -1,
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [{ value: true, type: "removed" }, { value: -1, type: "added" }]
            },
            complexHtml: {
                message:    "We should be able to handle HTML tables...",
                leftValue:  "<table border='0'><tr><td colspan='3'>The following specifications may only comply to some variants.</td></tr><tr><td colspan='3'><strong>Intended/suitable for one-hand operation</strong></td></tr><tr><td colspan='3'><strong>Left-hand keyboard</strong></td></tr><tr><td colspan='3'><strong>Wireless</strong></td></tr></table>",
                rightValue: "<table border='0'><tr><td colspan='3'>The following specifications may only apply to some variants.</td></tr><tr><td colspan='3'><strong>Intended/suitable for one-hand operation</strong></td></tr><tr><td colspan='3'><strong>Left-hand keyboard</strong></td></tr><tr><td colspan='3'><strong>Wireless</strong></td></tr></table>",
                options: {
                    markdownItOptions: { html: true, breaks: true }
                },
                expected:   [
                    {
                        "value": "The following specifications may only ",
                        "type": "unchanged"
                    },
                    {
                        "value": "comply",
                        "type": "removed"
                    },
                    {
                        "value": "apply",
                        "type": "added"
                    },
                    {
                        "value": " to some variants.Intended/suitable for one-hand operationLeft-hand keyboardWireless",
                        "type": "unchanged"
                    }
                ]
            },
            massive: {
                message:    "We should be able to handle a large comparison.",
                leftValue:  "-Machine translation- Main Features: - Capture system: digital camera - OCR-module: Abby FinReader - Battery: no - Automatic language detection: yes Additional information: - In Belgium EasyReaderPlus is also sold under the name Retina. There are four versions of the Retina: Basic, Pro, Zoom and Touch. - The base unit is a narrow and high enclosure with a sloping top. At the top there are seven control buttons en the camera slides via a folding arm into the base unit. This is Retina Basic. - Retina Pro consists of the base unit with an extra keyboard. The keyboard is used fot advanced features such as save, import (PDF, BMP, JPEG, PNG and TIFF), placing bookmarks, multi-page processing (up to 20 pages per minute) and exporting tect as MP3 sound files. - Retina Zoom consists of four elements: the base unit, the keyboard, a trackball and a widescreen display. - On the display the text can be showed enlarged an in different color combinations (max. 64). The text can either be moved horizantally or vertically with the trackball. In the mean time the text is read. - Retina Touch comes with a touchscreen instead of an ordinary screen. Now you can use your finger to indicate the word where Retina should start to read. - Text on round objects such as cans can also be read. - The text is placed in front of the unit and under the camera to then be read. You can listen to the sound via the built-in stereo speakers or a headphone. - The unit comes standard wtih one language of choice. Each language contains multiple voices. You can choose form 17 languages, of which up to four can be intstalled on the device. The reading unit automatically switches to the appropriate language. - Includes accessoires: headphone with volume control an a high-contrast mat to position the text under the camera. - Power supply: 110-240 V - Dimensions base unit: 22 x 12 x 26 cm - Weight base unti: 2,45 kg Producer VISIONAID INTERNATIONAL Great Britain E-mail: sales@visionaid-international.com Suppliers and prices Belgium: Ergra Angels: EUR 1 860 for a Basic language (May 2011, including VAT) Belgium: Integra: EUR 1995-3395 (April 2011, including VAT) Netherlands: Slechtziend.nl: EUR 1,055 for the basic version (April 2011, including VAT)",
                rightValue: "Main Features:<br>- Capture system: digital camera<br>- OCR-module: Abby FinReader<br>- Battery: no<br>- Automatic language detection: yes<br>Additional information:<br>- In Belgium EasyReaderPlus is also sold under the name Retina. There are four versions of the Retina: Basic, Pro, Zoom and Touch.<br>- The base unit is a narrow and high enclosure with a sloping top. At the top there are seven control buttons en the camera slides via a folding arm into the base unit. This is Retina Basic.<br>- Retina Pro consists of the base unit with an extra keyboard. The keyboard is used fot advanced features such as save, import (PDF, BMP, JPEG, PNG and TIFF), placing bookmarks, multi-page processing (up to 20 pages per minute) and exporting tect as MP3 sound files.<br>- Retina Zoom consists of four elements: the base unit, the keyboard, a trackball and a widescreen display.<br>- On the display the text can be showed enlarged an in different color combinations (max. 64). The text can either be moved horizantally or vertically with the trackball. In the mean time the text is read.<br>- Retina Touch comes with a touchscreen instead of an ordinary screen. Now you can use your finger to indicate the word where Retina should start to read.<br>- Text on round objects such as cans can also be read.<br>- The text is placed in front of the unit and under the camera to then be read. You can listen to the sound via the built-in stereo speakers or a headphone.<br>- The unit comes standard wtih one language of choice. Each language contains multiple voices. You can choose form 17 languages, of which up to four can be intstalled on the device. The reading unit automatically switches to the appropriate language.<br>- Includes accessoires: headphone with volume control an a high-contrast mat to position the text under the camera.<br>- Power supply: 110-240 V<br>- Dimensions base unit: 22 x 12 x 26 cm<br>- Weight base unti: 2,45 kg<br>Producer<br>VISIONAID INTERNATIONAL<br>Great Britain<br>E-mail: sales@visionaid-international.com<br>Suppliers and prices<br>Belgium: Ergra Angels: EUR 1 860 for a Basic language (May 2011, including VAT)<br>Belgium: Integra: EUR 1995-3395 (April 2011, including VAT)<br>Netherlands: Slechtziend.nl: EUR 1,055 for the basic version (April 2011, including VAT)<br>",
                options: {
                    markdownItOptions: { html: true, breaks: true },
                    // TODO: update this once we've improved performance further.
                    lcsOptions: { timeout: 30000}
                }
            },
            massive2: {
                message: "We should be able to handle a large multi-line comparison.",
                leftValue: "Product Type:<br />mouse button mulation, entry modification to the mouse button operation<br /><br />Areas of Application:<br />- enables left- and right-click with touchscreen operation<br />- enables or facilitates mouse button operation pronounced cerebral or central movement disorders, neurological disorders or neuromuscular disabilities (ALS), spastic and flaccid paralysis, if the operation of a pointing device, but not a mouse button operation of the pointing device is possible<br />- necessary as an additional program in conjunction with mouse simulators when the mouse button operation can only be done via a button or a residence<br /><br />Features / Components:<br />DIPAX ClickMaster is a software program for Windows, the mouse functions like click, double click, etc. can be automatically triggered.<br />About integrated retention functions can perform various mouse functions. In a menu on the screen buttons are shown, each of the mouse button functions: Click left mouse button, click right mouse button, click the middle mouse button, click and drag the left, double-click the left. After a pre-selection of these mouse buttons function buttons the appropriate mouse button function is triggered automatically when the mouse pointer stops moving an adjustable time<br /><br />Functions and Features:<br />- mouse button functions: Click left, right, center;. Click and drag; Double<br />- Optional progress indicator for the remaining period until the preselected action will be applied.<br />- Menu can be displayed horizontally, vertically, or double-breasted<br />- 3 different display sizes (Zoom) adjusted.<br />- Unnecessary actions can be hidden from the menu . be<br />- All parameters (including last position of the menu) are stored<br />- Adjustable response time and motion tolerance (jitter sensitivity)<br />- Kundenspezifiche enhancements / adjustments possible<br /><br />System:<br />- Windows XP / Vista / 7/8 / 8.1 / 10<br />contents:<br />- CD - manual<br /><br />Other: demo version on the website of the manufacturer available for free<br /><br />Price (without guarantee):<br />The price is available on request from the manufacturer / distributor..<br /><br />The translation of the content is performed by the external website Google™ Translate.<br />The service provides automated computer translations. <br />REHADAT assumes no reponsibility or liability for the complete accuracy of the content.<br/>",
                rightValue: "Product type:<br />Mouse key emulation, input modification for matte button operation<br /><br />Areas of Application:<br />- allows left and right clicks with touchscreen operation<br />- enables or facilitates keyboard operation with pronounced cerebral or central movement disorders, neurological disturbances or neuromuscular disabilities (ALS), spastic and flaccid Paralysis, if the operation of a pointing device is not possible, but not a mouse button operation of the pointing device<br />- as an additional program in conjunction with mouse simulators necessary if the mousing button operation can only take place via a push button or a dwell time<br /><br />Features / Components:<br />DIPAX ClickMaster is a software program For Windows, which can be used to automatically trigger the mouse functions such as clicking, double clicking, etc. In addition, keys and key combinations can be triggered.<br /><br />Various mouse or button functions can be performed via integrated dwell time functions. In a menu on the screen, buttons are displayed for the mouse button functions: Click Left mouse button, Right mouse button, Click Middle mouse button, Click and drag left, Double click left. After pre-selection of one of these mosaic function buttons, the corresponding mosaic button function is triggered automatically after the mouse pointer has not been moved for an adjustable time.<br /><br />Functions and properties:<br />- Button functions: Click left, right, center; Click and drag; Double-click<br />- Keys and key combinations can be triggered<br />- Optional progress indicator for the remaining time until the preselected action is applied<br />- Menu can be displayed horizontally, vertically or double row<br />- Several different display sizes can be adjusted<br />- Unable actions can be dimmed from the menu<br />- All parameters (including last position of the menu) are saved<br />- Adjustable triggering time and movement tolerance (dither sensitivity)<br />- Customer-specific extensions / adaptions possible<br />System requirements:<br />- Windows Vista / 7/8 / 8.1 / 10<br />Extent of delivery:<br />- CD<br /><br />Other: Demoversion available on the manufacturers website free of charge<br /><br />The price is available on request from the manufacturer / distributor.<br /><br />The translation of the content is performed by the external website Google™ Translate.<br />The service provides automated computer translations. <br />REHADAT assumes no reponsibility or liability for the complete accuracy of the content.<br/>",
                options: {
                    markdownItOptions: { html: true, breaks: true },
                    // TODO: update this once we've improved performance further.
                    lcsOptions: { timeout: 30000}
                }
            }
        }
    }
});
