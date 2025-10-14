// ==UserScript==
// @name         Gladiator.tf bot owner script
// @namespace    https://gladiator.tf/
// @version      2.0
// @author       Gladiator.TF
// @description  A script for owners of bots on gladiator.tf
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @connect      gladiator.tf
// @connect      backpack.tf
// @connect      next.backpack.tf
// @license      MIT

// @homepageURL     https://github.com/gladiatortf/gladiator.tf-bot-owner-script/
// @supportURL      https://github.com/gladiatortf/gladiator.tf-bot-owner-script/issues
// @downloadURL     https://github.com/gladiatortf/gladiator.tf-bot-owner-script/raw/master/gladiator.user.js
// @updateURL       https://github.com/gladiatortf/gladiator.tf-bot-owner-script/raw/master/gladiator.user.js

// @run-at       document-end
// @match        https://backpack.tf/*
// @match        https://next.backpack.tf/*
// @match        https://*.gladiator.tf/*

// ==/UserScript==

(async function () {
	("use strict");

	const WEAPONS = [
		"Frying Pan",
		"Black Rose",
		"Conscientious Objector",
		"Shortstop",
		"Big Kill",
		"Sniper Rifle",
		"Flame Thrower",
		"Shotgun",
		"Bat Outta Hell",
		"Rocket Launcher",
		"Lugermorph",
		"Spy-cicle",
		"Grenade Launcher",
		"Minigun",
		"Air Strike",
		"Scattergun",
		"Batsaber",
		"Bushwacka",
		"Market Gardener",
		"Stickybomb Launcher",
		"Sticky Jumper",
		"Medi Gun",
		"Pistol",
		"Half-Zatoichi",
		"Widowmaker",
		"Vaccinator",
		"Original",
		"Bat",
		"Classic",
		"Gunslinger",
		"Cow Mangler 5000",
		"Pretty Boy's Pocket Pistol",
		"Crusader's Crossbow",
		"Diamondback",
		"Gloves of Running Urgently",
		"Fists",
		"Righteous Bison",
		"Tomislav",
		"Homewrecker",
		"Force-A-Nature",
		"Phlogistinator",
		"Eyelander",
		"Beggar's Bazooka",
		"Eviction Notice",
		"Black Box",
		"Boston Basher",
		"Quick-Fix",
		"Solemn Vow",
		"Eureka Effect",
		"Kritzkrieg",
		"Fists of Steel",
		"Huntsman",
		"SMG",
		"Shovel",
		"Knife",
		"Loose Cannon",
		"Scottish Handshake",
		"Fortified Compound",
		"Powerjack",
		"Conniver's Kunai",
		"Neon Annihilator",
		"Rescue Ranger",
		"Flare Gun",
		"Wrap Assassin",
		"Vita-Saw",
		"Brass Beast",
		"Escape Plan",
		"Degreaser",
		"Sharpened Volcano Fragment",
		"Pomson 6000",
		"Wrench",
		"Manmelter",
		"Baby Face's Blaster",
		"Bazaar Bargain",
		"Huo-Long Heater",
		"Back Scatter",
		"Machina",
		"Cleaner's Carbine",
		"C.A.P.P.E.R",
		"Fan O'War",
		"Shooting Star",
		"L'Etranger",
		"Postal Pummeler",
		"Short Circuit",
		"Ullapool Caber",
		"Winger",
		"Ambassador",
		"Enforcer",
		"Natascha",
		"Overdose",
		"Sandman",
		"Scorch Shot",
		"Sun-on-a-Stick",
		"Loch-n-Load",
		"Flying Guillotine",
		"Backburner",
		"Equalizer",
		"Claidheamh Mòr",
		"Back Scratcher",
		"Bottle",
		"Persian Persuader",
		"Syringe Gun",
		"Third Degree",
		"Killing Gloves of Boxing",
		"Amputator",
		"AWPer Hand",
		"Frontier Justice",
		"Pain Train",
		"Ubersaw",
		"Disciplinary Action",
		"Holiday Punch",
		"Scottish Resistance",
		"Axtinguisher",
		"Jag",
		"Hitman's Heatmaker",
		"Nessie's Nine Iron",
		"Detonator",
		"Sydney Sleeper",
		"Tribalman's Shiv",
		"Soda Popper",
		"Direct Hit",
		"Mantreads",
		"Maul",
		"Rainblower",
		"Holy Mackerel",
		"Reserve Shooter",
		"Warrior's Spirit",
		"Candy Cane",
		"Blutsauger",
		"Southern Hospitality",
		"Shahanshah",
		"Lollichop",
		"Bread Bite",
		"Family Business",
		"Big Earner",
		"Liberty Launcher",
		"Scotsman's Skullcutter",
		"Sharp Dresser",
		"Revolver",
		"Your Eternal Reward",
		"Three-Rune Blade",
		"Chargin' Targe",
		"Nostromo Napalmer",
		"Iron Bomber",
		"Bonesaw",
		"Apoco-Fists",
		"Panic Attack",
		"Freedom Staff",
		"Prinny Machete",
		"Ham Shank",
		"Kukri",
		"Quickiebomb Launcher",
		"Fire Axe",
		"Unarmed Combat",
		"Wanga Prick",
		"Dragon's Fury",
		"Hot Hand",
		"Festive",
		"Botkiller"
	];

	const BPTF_CSS = `
        .glad-fieldset {
            padding: revert!important;
            margin: revert!important;
            border: 1px solid silver!important;
            display: flex;
            align-items: center;
            width: fit-content;
        }
        .glad-fieldset > legend{
            width: revert!important;
            border-bottom: 0!important;
            margin-bottom: revert!important;
            font-size: 1.5rem;
        }
        .glad-fieldset span {
            color: #B45309;
        }
        .glad-fieldset legend{
            font-weight: 500;
        }

        .li-gladiator-options a {
            display: flex!important;
            align-items: center;
            justify-content: flex-start;
        }
        .li-gladiator-options svg{
            width: 1.25em;
            height: 1.25em;
            margin-right: 3px;
        }
        .li-gladiator-options path {
            fill: #333;
        }
        .gladiatortf-add > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor:pointer;
            margin-top: 0;
        }

        .glad-reload {
            pointer-events: none;
        }
        .glad-reload button{
            pointer-events:all;
        }

        @media (max-width: 958.999px){
            .dropdown-menu path {
                fill: #888!important;
            }
        }`;
	const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" class="fa-fw svg-inline--fa" viewBox="0 0 24.83 27.44"><defs><style>.cls-1{fill:#fff;}.cls-2{fill:#fbb040;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M16.4,6.66a7.49,7.49,0,0,0-2.85.55A12.57,12.57,0,0,0,11,8.58a10.4,10.4,0,0,0-3.17,3.57A9.92,9.92,0,0,0,6.66,17a9.87,9.87,0,0,0,1.19,4.8,10.28,10.28,0,0,0,3.2,3.57,9.5,9.5,0,0,0,2.47,1.28,8.51,8.51,0,0,0,2.82.47h1a7.87,7.87,0,0,0,2.82-.51,12.39,12.39,0,0,0,2.55-1.33,11.37,11.37,0,0,0,1.4-1.19v-7.7H18.26l-2.65,3.49h3.72v2a5.15,5.15,0,0,1-2.29.55h-.29A6.21,6.21,0,0,1,14.67,22a4.94,4.94,0,0,1-1.73-1.13,4.69,4.69,0,0,1-1.13-1.8A6.35,6.35,0,0,1,11.46,17a6.43,6.43,0,0,1,.35-2.13A4.62,4.62,0,0,1,12.94,13a6.62,6.62,0,0,1,1.87-1.29,5.16,5.16,0,0,1,2.2-.51,6.85,6.85,0,0,1,1.52.17L17.15,13l4.28,0,2.73-3.28A9,9,0,0,0,17.1,6.66Z"/><path class="cls-2" d="M24.83,1.91,21.56,7.05a10.15,10.15,0,0,0-4.07-1L16.91,3l0,3H16.4a8.22,8.22,0,0,0-3.08.58,12.47,12.47,0,0,0-1.38.65,2,2,0,0,0-.31.19L10.2,6.66,11,7.9c-.1.07-.2.12-.29.19a10.31,10.31,0,0,0-3,3.22L5.47,10.17l2,1.5a1.74,1.74,0,0,0-.13.2A9.5,9.5,0,0,0,6.25,15L5,14.94l1.09.61v0A12.75,12.75,0,0,0,6.06,17a8.74,8.74,0,0,0,.19,2L4,19.86l2.35-.44a9.81,9.81,0,0,0,1,2.64,10.61,10.61,0,0,0,.9,1.29l-4.5,4.09L3.37,27l-.17-.22a8.63,8.63,0,0,1-.83-1.16l3-2.55L2,25A15,15,0,0,1,.8,22.11l.94-.55-1.09,0A16,16,0,0,1,0,17l3.46-.56L0,16.4a12,12,0,0,1,.2-2.09l1.31,0L.34,13.64a14.3,14.3,0,0,1,.8-2.86l2.61.7L1.33,10.34c.2-.46.41-.92.66-1.38A15.77,15.77,0,0,1,4.87,5.13l1,.66L5.28,4.72a16.87,16.87,0,0,1,1.91-1.6C7.75,2.74,8.33,2.37,8.94,2l.43-.21A18.21,18.21,0,0,1,11,1,12.86,12.86,0,0,1,14.7.12l.39,1.07L15.28.05c.37,0,.75,0,1.12,0h.68c.55,0,1.09,0,1.62.07l.14,2.5L19.13.12a15.79,15.79,0,0,1,5.09,1.5Z"/></g></g></svg>`;
	const TAG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-arrow-right-arrow-left" viewBox="0 0 640 640"><path fill="currentColor" d="M96.5 160L96.5 309.5C96.5 326.5 103.2 342.8 115.2 354.8L307.2 546.8C332.2 571.8 372.7 571.8 397.7 546.8L547.2 397.3C572.2 372.3 572.2 331.8 547.2 306.8L355.2 114.8C343.2 102.7 327 96 310 96L160.5 96C125.2 96 96.5 124.7 96.5 160zM208.5 176C226.2 176 240.5 190.3 240.5 208C240.5 225.7 226.2 240 208.5 240C190.8 240 176.5 225.7 176.5 208C176.5 190.3 190.8 176 208.5 176z"/></svg>`;
	const CLASSIC_SVG = {
		options: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.2 37">
    <path d="m19.7 0-6.4 1.8L15.7 7l-.6.4-.5.2a16.9 16.9 0 0 0-3.4 2.5l-4-4.4-4 5 5 3-.5.8A18.2 18.2 0 0 0 6 19.2v.2L.3 18 0 24.7l5.8-.5a16.4 16.4 0 0 0 1.2 5l-5.4 2.3L5 37l5.8-4.7 3.5-2.8v-.1l-.2-.3-.4-.5a9.6 9.6 0 0 1-1-1.8 10.3 10.3 0 0 1-.8-3 8 8 0 0 1 0-1.9v-.3l.1-1c.2-1 .5-2 1.1-3l.4-.6c.2-.5.5-.9.8-1.2h.1a15.6 15.6 0 0 1 2.2-2.2 16 16 0 0 1 1.7-1 9.8 9.8 0 0 1 2-.7l.8-.1h.1l1-.1a13.2 13.2 0 0 1 4 .6h.2l1.1.5h.3l1-1.9 4.5-8.5-6-2.1L26 6a16.8 16.8 0 0 0-5.6-.2L19.7 0z"/>
    <path d="M19.2 12.9c-.9.3-1.7.8-2.5 1.3a10.4 10.4 0 0 0-3.2 3.6 10 10 0 0 0-1.2 4.9 9.9 9.9 0 0 0 1.2 4.8 10.3 10.3 0 0 0 3.2 3.5 9.5 9.5 0 0 0 2.5 1.3c.9.3 1.8.5 2.8.5h1a8 8 0 0 0 2.8-.5 12.4 12.4 0 0 0 4-2.6V22h-5.9l-2.6 3.5H25v2a5 5 0 0 1-2.3.6h-.3a6.2 6.2 0 0 1-2-.4 5 5 0 0 1-3-3 6.3 6.3 0 0 1 0-4.2c.3-.7.7-1.3 1.2-1.8a6.6 6.6 0 0 1 1.9-1.3c.7-.4 1.4-.5 2.2-.5l1.5.1-1.4 1.7h4.3l2.7-3.3a9.6 9.6 0 0 0-6.5-3.1 8.3 8.3 0 0 0-4 .6Z" data-name="Layer 1"/>
  </svg>
  `
	};
	const NEXT_CSS = `
    .w-fit {
      width: fit-content;
    }

    .glad-match-button {
      cursor: pointer;
      padding-left: .5em;
      color: var(--component-text-color);
      transition: color .3s;
      font-size: 1.1em;
    }

    .glad-align-items-start {
      align-items: start;
    }

    .glad-item-tooltip-container {
      transition: all .3s;
      border-radius: 4px;
      border: 1px solid var(--component-border-color);
      display: flex;
      margin-top: .3em;
      margin-bottom: .3em;
      padding: .5em .7em;
    }

    .glad-item-tooltip-container:hover {
      color: var(--component-text-hover) !important;
      border-color: var(--component-text-color);
    }

    .glad-item-tooltip-logo-container {
        display: flex;
        text-align: left;
        margin-right: 4px;
        width: 25px;
        font-size: 1.2rem;

    }

    .glad-item-tooltip-text {
        align-self: flex-end;
        letter-spacing: .25px;
        font-size: 1em;
        color: var(--component-text-color);
    }

	.glad-stats-container {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

  `;

	const fieldset = `<fieldset class="glad-fieldset"><legend>Add to <span class="gladiator-bot-name">GladiatorTF Bot</span></legend><div class="btn-group btn-group-sm"> </div></fieldset>`;
	const API_URL = "https://gladiator.tf";
	const BOTS_TTL = 1000 * 60 * 60 * 24; // 1 day

	const isNext = typeof __NUXT__ !== "undefined";

	const Settings = {
		data: {
			manageContext: "my",
			bots: {},
			lastCache: 0,
			isKillstreakChecked: false,
			isUnuOnlyChecked: false
		},

		async load() {
			const data = await GM.getValue(
				"settings",
				JSON.stringify(this.data)
			);
			this.data = JSON.parse(data);
		},
		async save() {
			await GM.setValue("settings", JSON.stringify(this.data));
		},

		getBotById(searchId) {
			return Object.entries(this.data.bots).find(
				([name, id]) => id === searchId
			);
		}
	};

	const PageState = {
		currentPage: "",
		paginating: false,
		itemNames: []
	};

	const LOGGER = {
		info: msg => {
			console.log("[gladiator-bot-owner-script]: " + msg);
		},
		error: err => {
			console.error(
				"[gladiator-bot-owner-script] ERROR: " + typeof err === "string"
					? err
					: err.stack || err.message || err.error
			);
		}
	};

	runScript();
	function injectNextModal() {
		window.Modal = {
			render: (title, ...content) => {
				__NUXT__.state.modal = {
					title: title,
					modalBundle: null,
					modalContext: "gladiator"
				};

				// wait for modal to be created :)
				setTimeout(() => {
					const dialog =
						document.getElementsByClassName("page-dialog")[0];
					if (!dialog) {
						return;
					}

					for (const child of content) {
						if (typeof child === "string") {
							const p = document.createElement("p");
							p.innerHTML = child;
							dialog.append(p);
						} else {
							dialog.append(child);
						}
					}
				}, 100);
			},
			close: () => {
				__NUXT__.state.modal = {};
			}
		};
	}

	function setDefaultManageContext() {
		if (
			Settings.data.manageContext === "my" &&
			Object.keys(Settings.data.bots).length > 0
		) {
			Settings.data.manageContext =
				Settings.data.bots[Object.keys(Settings.data.bots)[0]];
		}
	}

	async function runScript() {
		await Settings.load();
		await getBots();

		setDefaultManageContext();

		const entrypoints = {
			"(gladiator.tf)|(127.0.0.1)": gladiatorUserscript,
			"backpack.tf|(proxy.gladiator.tf)|(127.0.0.1:2053)":
				backpackUserscript
		};

		execOnRegexMatch(entrypoints, window.location.origin, [
			window.location.pathname
		]);
	}

	function computeCurrentPage(pathname) {
		PageState.paginating = false;

		if (pathname === "/stats") {
			PageState.currentPage = "stats";
		} else if (pathname === "/classifieds") {
			PageState.currentPage = "classified";
		} else if (
			pathname.startsWith("/effects/") &&
			pathname.length > "/effects/".length
		) {
			PageState.currentPage = "effects";
		} else if (
			pathname.startsWith("/items/") &&
			pathname.length > "/items/".length
		) {
			PageState.currentPage = "items";
		} else if (pathname === "/pricelist") {
			PageState.currentPage = "pricelist";
		} else {
			PageState.currentPage = "";
		}
	}

	function backpackUserscript(pathname) {
		if (isNext) {
			LOGGER.info("On next site");
			computeCurrentPage(pathname);
			GM_addStyle(NEXT_CSS);
			injectNextModal();
			addLinksNext();
			addMatchPriceButtonsNext();
		} else {
			LOGGER.info("On classic site");
			GM_addStyle(BPTF_CSS);
			classicUserscript(pathname);
		}
	}

	function classicUserscript(pathname) {
		function killstreakCheck() {
			const check = $(
				`<label class="checkbox-inline" style="margin-left: 10px;"><input type="checkbox" id="add-ks" ${
					Settings.data.isKillstreakChecked ? "checked" : ""
				}>Add Killstreaks</label>`
			);

			check.find("input").on("click", function () {
				Settings.data.isKillstreakChecked = $(this).is(":checked");
				Settings.save();
			});

			return check;
		}

		function appendAddButtons(buttons, location) {
			const $buttonGroup = $(
				`<fieldset class="glad-fieldset"><legend>Add to <span class="gladiator-bot-name">GladiatorTF Bot</span></legend><div class="btn-group btn-group-sm"> </div></fieldset>`
			);

			buttons.forEach(button => {
				const [name, selector] = button;

				const hat = $(selector).find("h1").text();
				const parse = text =>
					`${text.replaceAll("\n", "").trim()} ${hat
						.replaceAll("\n", "")
						.trim()}`;

				const $button = $(
					`<a class="btn btn-variety q-440-text-1">${name}</a>`
				);
				$button.on("click", () => {
					let toAdd = [];

					if ($(selector).is("ul")) {
						$(selector)
							.find("li")
							.each(function () {
								toAdd.push(
									$(this).prop("title") ||
										$(this).data("original-title")
								);
							});
						bulkAdd(toAdd);
					} else {
						// there is some jank with list view, better to just make people use icon view
						Modal.render(
							"Error",
							"List view is unsupported, please switch to icon view"
						);
					}
				});

				$buttonGroup.find("div").append($button);
			});

			const $container = $(`<div style="width:100%;"></div>`).append(
				$buttonGroup
			);

			$(location).after($container);
		}

		function effect() {
			appendAddButtons(
				[["Add All Priced", "#unusual-pricelist"]],
				".input-group:first"
			);
		}

		function unusual() {
			appendAddButtons(
				[
					[
						"Add All",
						".unusual-pricelist, .unusual-pricelist-missing"
					],
					["Add All Priced", ".unusual-pricelist"],
					["Add All Unpriced", ".unusual-pricelist-missing"]
				],
				".input-group:first"
			);
		}

		function pricelist() {
			const waitOnPageToLoad = page => {
				return new Promise(resolve => {
					const check = () => {
						const $el = $(
							"#pricelistContainer > li:first > li span.label"
						);
						return (
							$el.attr("data-original-title") || $el.attr("title")
						);
					};

					let beforeReloadStyle = page === 1 ? null : check();
					document.defaultView.setCurrentPage(page);

					let reloadCheck = setInterval(() => {
						if (beforeReloadStyle !== check()) {
							clearInterval(reloadCheck);
							resolve();
						}
					}, 1000);
				});
			};

			const loadAll = addKS => {
				return new Promise(async (resolve, reject) => {
					if ($("#pricelist").is("table")) {
						// Spreadsheet view script
						reject(
							new Error(
								"Spreadsheet view is unsupported, please switch to grid view"
							)
						);
					}
					// Grid view script
					let items = [];
					const last = $(
						'#pricelist-pagination-container a:contains("Last")'
					).attr("href");
					const totalPages = parseInt(
						last.split("(")[1].split(")")[0]
					);
					for (let iterator = 1; iterator <= totalPages; iterator++) {
						await waitOnPageToLoad(iterator);
						$("#pricelistContainer")
							.find(".item")
							.each(function () {
								const price = $(this);
								let name = [price.find(".name").text()];

								if (addKS && isWeapon(name)) {
									name.push(...generateKillstreaks(name[0]));
								}

								items.push(...name);
							});
					}
					resolve(items);
				});
			};

			const loadCurrentPage = addKS => {
				if ($("#pricelist").is("table")) {
					// Spreadsheet view script
					Modal.render(
						"Error",
						"Spreadsheet view is unsupported, please switch to grid view"
					);
					return [];
				} else {
					// Grid view script
					let items = [];
					$("#pricelistContainer")
						.find(".item")
						.each(function () {
							const price = $(this);
							let name = [price.find(".name").text()];

							if (addKS && isWeapon(name)) {
								name.push(...generateKillstreaks(name[0]));
							}

							items.push(...name);
						});
					return items;
				}
			};

			const $add = $(
				`<a class="btn btn-variety q-440-text-1">Add All</a>`
			);
			const $addCurrent = $(
				`<a class="btn btn-variety q-440-text-1">Add Current Page</a>`
			);
			const $addButtonGroup = $(
				`<div class="btn-group btn-group-sm"></div>`
			);
			$addButtonGroup.append([$add, $addCurrent]);

			const $check = killstreakCheck();
			const $addBlock = $(
				'<a class="btn btn-variety q-440-text-1 disabled">Waiting...</a>'
			).hide();

			$add.on("click", () => {
				$($add, $addCurrent, $check, $addBlock).toggle();
				loadAll($("#add-ks").is(":checked"))
					.then(items => {
						bulkAdd(items);
						$($add, $addCurrent, $check, $addBlock).toggle();
					})
					.catch(error => {
						Modal.render("Error", error.message);
					});
			});

			$addCurrent.on("click", () => {
				$($add, $addCurrent, $check, $addBlock).toggle();
				const items = loadCurrentPage($("#add-ks").is(":checked"));
				bulkAdd(items);
				$($add, $addCurrent, $check, $addBlock).toggle();
			});

			const $fieldset = $(fieldset);
			const $container = $(`<div style="width:100%;"></div>`).append(
				$fieldset
			);

			$("#pricelist-filters").after($container);

			$fieldset
				.find("legend")
				.after([$addButtonGroup, $check, $addBlock]);
		}

		function renderSettingsFormClassic() {
			const $parent = $("<form id='glad-settings'></form>");

			const botAmount = Object.keys(Settings.data.bots).length;
			const $select = $(
				"<select id='manageContext' name='manageContext' class='form-control'></select>"
			);
			Object.entries(Settings.data.bots).forEach(bot => {
				$select.append(
					`<option value="${bot[1]}" ${
						Settings.data.manageContext === bot[1] ? "selected" : ""
					}>${bot[0]}</option>`
				);
			});

			const $bots = $(`<div class="form-group">
                                <label for="manageContext">Choose Your Bot</label>
                            </div>`);
			const $reload = $(
				`<div class="form-group glad-reload"><button class="btn btn-variety ">Reload Bots</button></div>`
			);
			$reload.on("click", async e => {
				e.preventDefault();
				Settings.data.lastCache = 0;
				await getBots();
				$parent.remove();
				$("#active-modal .modal-body").append(
					renderSettingsFormClassic()
				);
			});

			const $label = $bots.find("label");

			if (botAmount > 0) {
				$select.insertAfter($label);
			} else {
				$(`<span>You dont have any bots</span>`).insertAfter($label);
			}
			$parent.append($bots);
			$bots.after($reload);

			return $parent;
		}

		function submitSettingsFormClassic() {
			const formArray = $("#glad-settings").serializeArray();
			let formData = {};
			formArray.forEach(entry => (formData[entry.name] = entry.value));

			Settings.data.manageContext = formData["manageContext"]
				? formData["manageContext"]
				: "my";
			Settings.save();
		}

		function settings() {
			const modal = [
				"Settings",
				renderSettingsFormClassic(),
				$('<a class="btn btn-default" data-dismiss="modal">Save</a>')
			];
			const $settings = $(
				`<li class="li-gladiator-options"><a>${CLASSIC_SVG.options} Bot Settings</a> </li>`
			);
			$settings.on("click", () =>
				Modal.render(...modal).$base.on("hide.bs.modal", () => {
					submitSettingsFormClassic();
					reloadManageLink();
				})
			);

			$('.dropdown-menu [href="/settings"]').parent().after($settings);
		}
		// The add on gladiator button on Stats
		function bpStatsAdd() {
			const itemName = $(".stats-header-title").text().trim();

			const $addButton = $(`
            <a class="price-box gladiator-context gladiatortf-add" data-postfix="/item/${encodeURIComponent(
				itemName
			)}/add" target="_blank" data-tip="top" data-original-title="Gladiator.tf">
                <img src="https://gladiator.tf/favicon-96x96.png" alt="gladiator">
                <div class="text">
                    <div class="value" style="font-size: 14px;">Add on Gladiator.tf</div>
                </div>
            </a>
        `);

			const $fieldset = $(fieldset).append($addButton);

			const $container = $(`<div style="width:100%;"></div>`).append(
				$fieldset
			);
			$container.append($fieldset);

			const extractedName = $(".stats-header-item > [data-base_name]")
				.attr("data-base_name")
				.trim();

			let variants = [];

			$(
				".stats-quality-list a:not(#btn-expand-list):not(.untradable)"
			).each(function () {
				let prefix = $(this).text().trim();
				const href = $(this).attr("href");
				if (
					href.includes("Minimal%20Wear") ||
					href.includes("Factory%20New") ||
					href.includes("Field-Tested") ||
					href.includes("Battle%20Scarred") ||
					href.includes("Well-Worn")
				)
					return;

				if (
					prefix.includes("Hot") ||
					prefix.includes("Isotope") ||
					prefix.includes("Cool") ||
					prefix.includes("Energy")
				)
					return;

				if (prefix.includes("Australium"))
					prefix = "Strange Australium";
				if (
					prefix.includes("Unique") &&
					!prefix.includes("Strange Unique")
				) {
					variants.push(`${extractedName}`);
				} else {
					prefix.includes("#")
						? variants.push(`${extractedName} ${prefix}`)
						: variants.push(`${prefix} ${extractedName}`);
				}
			});

			const $addAllButton = $(`
            <a class="price-box gladiatortf-add" data-original-title="Gladiator.tf">
                <img src="https://gladiator.tf/favicon-96x96.png" alt="gladiator">
                <div class="text">
                    <div class="value" style="font-size: 14px;">Add All Variants</div>
                </div>
            </a>
        `).on("click", function () {
				const variantsPayload = variants;

				if ($("#add-ks").is(":checked")) {
					variants.forEach(variant => {
						variantsPayload.push(...generateKillstreaks(variant));
					});
				}

				bulkAdd(variantsPayload);
			});

			$fieldset.append($addAllButton);

			if (isWeapon(itemName)) {
				const $check = killstreakCheck();
				$addButton.on("click", () => {
					if ($check.is(":checked")) {
						const items = [...generateKillstreaks(itemName)];
						bulkAdd(items);
					}
				});
				$fieldset.append($check);
			}

			$(".price-boxes").append($container);
		}

		// The add on gladiator button on popups
		function bpPopupAdd() {
			$("body").on("mouseover", ".item", function () {
				let self = this;
				let id = setInterval(function () {
					if ($(self).next().hasClass("popover")) {
						let popover = $(self)
							.next()
							.find("#popover-price-links");

						if (popover.find(`.gladiator-add-button`).length == 0) {
							popover.append(
								'<a class="btn btn-default gladiator-add-button btn-xs" href="' +
									`${API_URL}/manage/${
										Settings.data.manageContext
									}/item/${encodeURIComponent(
										$($(self)[0]).data("original-title")
									)}/add` +
									'" target="_blank"><img src="https://gladiator.tf/favicon-96x96.png" style=\'width: 16px;height: 16px;margin-top: -2px;\'> Add on Gladiator.tf</a>'
							);
						}

						clearInterval(id);
					}
				}, 50);
				setTimeout(function () {
					clearInterval(id);
				}, 750);
			});
		}

		// After settings are changed we gotta update the links
		function reloadManageLink() {
			const manageContext = Settings.data.manageContext || "my";

			const botName =
				Settings.data.manageContext !== "my"
					? Object.entries(Settings.data.bots).filter(
							([name, id]) => id === Settings.data.manageContext
					  )[0][0]
					: "GladiatorTF Bot";

			$(".gladiator-context").each(function () {
				$(this).attr(
					"href",
					`${API_URL}/manage/${manageContext}${$(this).data(
						"postfix"
					)}`
				);
			});

			$(".gladiator-bot-name").text(botName);
		}

		$('[title="Gladiator.tf Instant Trade"]').css("margin-right", "3px");

		for (let i of document.getElementsByClassName("price-box")) {
			if (i.origin === `${API_URL}`) {
				return;
			}
		}

		function addMatchButtons() {
			const keyEx = /(\d*(.\d*)?(?= keys?))/;
			const refEx = /\d*(.\d*)?(?= ref)/;

			// Parse text into a price object
			const parseListingPrice = function (price) {
				return {
					keys: parseFloat(
						keyEx.exec(price) ? keyEx.exec(price).shift() : 0
					),
					metal: parseFloat(
						refEx.exec(price) ? refEx.exec(price).shift() : 0
					)
				};
			};

			// Do not match these
			const hasBlacklistedProperties = function (info) {
				if (
					info.data("paint_name") !== undefined ||
					info.data("spell_1") !== undefined ||
					info.data("part_price_1") !== undefined ||
					info.data("killstreaker") !== undefined ||
					info.data("sheen") !== undefined
				) {
					return true;
				}

				return false;
			};

			// Spawns the actual button
			const spawnMatchButton = function () {
				let element = $(this);
				const info = element.find(".item");
				const price = parseListingPrice(
					info.data("listing_price") || ""
				);
				const match = `<a data-postfix="/item/${encodeURIComponent(
					(info.prop("title") || info.data("original-title")).trim()
				)}?keys=${price.keys}&metal=${price.metal}&intent=${info.data(
					"listing_intent"
				)}" title="Match this user's price" target="_blank" class="btn btn-bottom btn-xs btn-success gladiator-context">
                <i class="fa fa-sw fa-tags"></i>
            </a>`;

				if (
					!hasBlacklistedProperties(info) ||
					info.data("listing_intent") === "sell"
				)
					element.find(".listing-buttons").prepend(match);
			};

			let sellers = $($(".media-list")[0]);
			let buyers = $($(".media-list")[1]);

			sellers.find(".listing").each(spawnMatchButton);
			buyers.find(".listing").each(spawnMatchButton);

			// what the fuck
			document.defaultView.jQuery(".fa-tags").parent().tooltip(); // VERY gross hack for tooltips
		}

		const patterns = {
			".*": [settings, bpPopupAdd],
			"(/stats)|(/classifieds)": [addMatchButtons],
			"/stats": [bpStatsAdd],
			"effect/": [effect],
			"unusual/": [unusual],
			pricelist: [pricelist]
		};
		try {
			execOnRegexMatch(patterns, pathname);
		} catch (ex) {
			console.error(ex);
		}
		reloadManageLink();
	}

	function gladiatorUserscript(pathname) {
		$("body").attr("data-extension-active", true);
	}

	/** @typedef {Object<string, Function|Function[]>} MatchExec */
	/**
	 * @param {MatchExec} matchAndExec
	 * @param {string} test
	 * @param {any[]|any[][]} [payload]
	 */
	function execOnRegexMatch(matchAndExec, test, payload = []) {
		Object.entries(matchAndExec).forEach(entry => {
			const [regex, toExecute] = entry;

			const regexObj = new RegExp(regex);

			if (regexObj.test(test)) {
				try {
					//Errors of any function should not prevent the rest from executing
					if (typeof toExecute === "function") toExecute(...payload);
					if (Array.isArray(toExecute)) {
						for (let i = 0; i < toExecute.length; i++) {
							if (typeof toExecute[i] === "function") {
								let localPayload = [];
								if (Array.isArray(payload[i]))
									localPayload = payload[i];

								toExecute[i](...localPayload);
							}
						}
					}
				} catch (ex) {
					console.error(ex);
				}
			}
		});
	}

	function createGladiatorButton(element, text, className) {
		element.className =
			"btn btn-outline-brand" + (className ? ` ${className}` : "");
		element.innerHTML = `${LOGO_SVG} ${text}`;
	}

	function getAddLink(itemName, keys, metal, intent) {
		const params = new URLSearchParams();

		if (keys) {
			params.append("keys", keys);
		}

		if (metal) {
			params.append("metal", metal);
		}

		if (intent) {
			params.append("intent", intent);
		}

		const query = params.toString()?.length ? `?${params.toString()}` : "";

		return `${API_URL}/manage/${
			Settings.data.manageContext
		}/item/${encodeURIComponent(itemName)}/add${query}`;
	}
	function addStatsButtonNext(statsItem) {
		const button = document.createElement("a");
		const itemName = document.querySelector("h2").innerText.trim();
		const params = new URLSearchParams(window.location.search);
		const baseItemName = params.get("item");

		button.target = "_blank";
		button.href = getAddLink(itemName);

		createGladiatorButton(button, "Add on Gladiator.tf");
		const addAllButton = document.createElement("a");
		addAllButton.href = `${window.location.origin}/items/${baseItemName}`;
		createGladiatorButton(addAllButton, "Add all Variants");

		const container = createButtonWrapperNext(
			[button, addAllButton],
			"pt-2 glad-stats-container"
		);

		statsItem.appendChild(container);
	}

	function createCheckbox(id, checked, onChange, labelText) {
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = id;
		checkbox.name = id;
		checkbox.value = id;
		checkbox.checked = checked;
		checkbox.addEventListener("change", onChange);

		const label = document.createElement("label");
		label.htmlFor = id;
		label.appendChild(checkbox);
		label.appendChild(document.createTextNode(labelText));

		return label;
	}

	function addAddAllButtonNext(node) {
		const addAllButton = document.createElement("button");
		createGladiatorButton(addAllButton, "Add All");

		const addPriceButton = document.createElement("button");
		createGladiatorButton(addPriceButton, "Add Priced Items");

		const addUnpricedButton = document.createElement("button");
		createGladiatorButton(addUnpricedButton, "Add Unpriced Items");

		addAllButton.addEventListener("click", () => {
			const items = getItems();

			bulkAdd(items.map(item => item.name));
		});

		addPriceButton.addEventListener("click", () => {
			const items = getItems();
			const pricedItems = items.filter(item => !item.unpriced);

			bulkAdd(pricedItems.map(item => item.name));
		});

		addUnpricedButton.addEventListener("click", () => {
			const items = getItems();
			const unpricedItems = items.filter(item => item.unpriced);

			bulkAdd(unpricedItems.map(item => item.name));
		});

		let buttons = [addPriceButton, addUnpricedButton, addAllButton];

		if (PageState.currentPage !== "effects") {
			const checkboxContainer = modifierCheckboxes();
			buttons.push(checkboxContainer);
		}

		const container = createButtonWrapperNext(buttons, "p-4");

		node.appendChild(container);
	}

	function getAddLabel() {
		return `Add to ${
			Settings.getBotById(Settings.data.manageContext)?.[0] ||
			"Gladiator.TF Bot"
		}`;
	}

	function createButtonWrapperNext(buttons, className = "") {
		const containerContainer = document.createElement("div");
		containerContainer.className = className;
		containerContainer.style.flex = "0 1 100%";

		const containerTitle = document.createElement("h4");
		containerTitle.textContent = getAddLabel();
		containerTitle.className = "m-1";

		const container = document.createElement("div");
		container.className =
			"p-toolbar justify-content-start flex-column glad-align-items-start";
		container.style.maxWidth = "max-content";

		const buttonsWrapper = document.createElement("div");
		buttonsWrapper.className = "d-flex justify-content-start gap-2";

		container.appendChild(containerTitle);

		container.appendChild(buttonsWrapper);

		buttons.forEach(button => {
			buttonsWrapper.appendChild(button);
		});

		containerContainer.appendChild(container);

		return containerContainer;
	}

	function handleListingNode(listing) {
		const price = listing.__vue__._props.listing.currencies;
		const intent = listing.__vue__._props.listing.intent;
		const item = listing.__vue__._props.listing.item;
		const itemName = item.name;

		const isPriced = price.keys > 0 || price.metal > 0;
		if (!isPriced) {
			return;
		}

		const hasBlacklistedProperties = () => {
			if (
				item.killstreaker !== undefined ||
				item.killeaters !== undefined ||
				item.strangeParts !== undefined ||
				item.spells !== undefined ||
				(item.paint !== undefined && item.paint.id !== item.defindex) // For paint cans ignore
			) {
				return true;
			}
		};

		if (hasBlacklistedProperties() && intent !== "sell") {
			return;
		}

		const button = createMatchButtonNext(itemName, price, intent);

		const actions = listing.querySelector(".listing__details__actions");
		actions.appendChild(button);
	}

	function createMatchButtonNext(itemName, price, intent) {
		const button = document.createElement("a");
		button.className = "glad-match-button";
		button.innerHTML = TAG_SVG;
		button.href = getAddLink(
			itemName,
			price.keys ?? 0,
			price.metal ?? 0,
			intent
		);
		button.target = "_blank";
		return button;
	}

	function addMatchPriceButtonsNext() {
		const listings = document.querySelectorAll(".listing");
		listings.forEach(listing => {
			handleListingNode(listing);
		});
	}

	function renderSettingsFormNext() {
		return `
      <label for="manageContext">Choose Your Bot</label>
      <select id="manageContext" name="manageContext"  class="form-control w-fit">
        ${Object.entries(Settings.data.bots)
			.map(
				([name, id]) =>
					`<option value="${id}" ${
						Settings.data.manageContext === id ? "selected" : ""
					}>${name}</option>`
			)
			.join("")}
      </select>
    `;
	}

	/**
	 *
	 * @param {{label: string, value: string}[]} options
	 * @param {string|null} selected
	 * @param {string} textLabel
	 * @returns
	 */
	function injectNextDropdown(options, selected, textLabel = "Select") {
		const dropdown = document.createElement("div");
		dropdown.className =
			"p-dropdown p-component p-inputwrapper p-inputwrapper-filled p-inputwrapper-focus";
		dropdown.style.position = "relative";

		const hiddenInputWrapper = document.createElement("div");
		hiddenInputWrapper.className = "p-hidden-accessible";
		const hiddenInput = document.createElement("input");
		hiddenInput.type = "text";
		hiddenInput.readOnly = true;
		hiddenInput.value = selected;
		hiddenInput.name = "manageContext";
		hiddenInput.id = "manageContext";
		hiddenInputWrapper.appendChild(hiddenInput);

		const label = document.createElement("span");
		label.className = "p-dropdown-label p-inputtext";
		label.textContent =
			options.find(option => option.value === selected)?.label ??
			textLabel;

		const trigger = document.createElement("div");
		trigger.setAttribute("role", "button");
		trigger.className = "p-dropdown-trigger";
		const triggerIcon = document.createElement("span");
		triggerIcon.className = "p-dropdown-trigger-icon pi pi-chevron-down";
		trigger.appendChild(triggerIcon);

		const panel = document.createElement("div");
		panel.className = "p-dropdown-panel p-component";
		panel.style.zIndex = "1009";
		panel.style.transformOrigin = "center top 0px";
		panel.style.position = "absolute";
		panel.style.minWidth = "100px";
		panel.style.display = "none";

		const itemsWrapper = document.createElement("div");
		itemsWrapper.className = "p-dropdown-items-wrapper";
		itemsWrapper.style.maxHeight = "200px";
		itemsWrapper.style.overflowY = "auto";

		const itemsList = document.createElement("ul");
		itemsList.setAttribute("role", "listbox");
		itemsList.className = "p-dropdown-items";

		function updateSelection(option) {
			selected = option.value;
			hiddenInput.value = option.value;
			label.textContent = option.label;
			Array.from(itemsList.children).forEach(li => {
				if (option.value === li.value) {
					li.classList.add("p-highlight");
					label.textContent = option.label;
				} else {
					li.classList.remove("p-highlight");
				}
			});
			panel.style.display = "none";
		}

		options.forEach(option => {
			const li = document.createElement("li");
			li.setAttribute("role", "option");
			li.value = option.value;
			li.className =
				"p-dropdown-item" +
				(option.value === selected ? " p-highlight" : "");
			li.textContent = option.label;

			itemsList.appendChild(li);

			li.addEventListener("click", e => {
				e.stopPropagation();
				updateSelection(option);
			});
		});

		itemsWrapper.appendChild(itemsList);
		panel.appendChild(itemsWrapper);

		dropdown.appendChild(hiddenInputWrapper);
		dropdown.appendChild(label);
		dropdown.appendChild(trigger);

		// Append panel to body for overflow
		document.body.appendChild(panel);

		function positionPanel() {
			const rect = dropdown.getBoundingClientRect();
			panel.style.minWidth = rect.width + "px";
			panel.style.left = rect.left + "px";
			panel.style.top = rect.bottom + "px";
		}

		dropdown.addEventListener("click", e => {
			e.stopPropagation();
			if (panel.style.display === "none") {
				positionPanel();
				panel.style.display = "";
			} else {
				panel.style.display = "none";
			}
		});

		document.addEventListener("click", e => {
			if (panel.style.display !== "none") {
				panel.style.display = "none";
			}
		});

		return dropdown;
	}

	function settingFormNext() {
		const form = document.createElement("form");
		form.className = "d-flex flex-column gap-2 pb-4";
		form.style.minWidth = "300px";

		function createDropdown() {
			return injectNextDropdown(
				Object.entries(Settings.data.bots).map(([name, id]) => ({
					label: name,
					value: id
				})),
				Settings.data.manageContext,
				"Select Bot"
			);
		}

		let manageContextDropdown = createDropdown();

		const refreshButton = document.createElement("button");
		refreshButton.className = "btn btn-outline-brand me-1 w-fit";
		refreshButton.textContent = "Refresh Bots";
		refreshButton.type = "button";

		const manageContextLabel = document.createElement("label");
		manageContextLabel.style.fontWeight = "semibold";
		manageContextLabel.textContent = "Choose Your Bot";

		const manageContextContainer = document.createElement("div");
		manageContextContainer.className = "d-flex flex-column gap-2";
		manageContextContainer.appendChild(manageContextDropdown);

		refreshButton.addEventListener("click", e => {
			e.preventDefault();
			e.stopPropagation();
			Settings.data.lastCache = 0;
			getBots().then(() => {
				manageContextContainer.removeChild(manageContextDropdown);
				manageContextDropdown = createDropdown();

				manageContextContainer.appendChild(manageContextDropdown);
			});
		});

		form.appendChild(manageContextLabel);
		form.appendChild(manageContextContainer);
		form.appendChild(refreshButton);

		return form;
	}

	function addSettingsButtonNext(node) {
		const button = document.createElement("button");
		button.className = "btn btn-outline-brand me-1";
		button.innerHTML = LOGO_SVG;

		const submitButton = document.createElement("button");
		submitButton.className = "btn btn-outline-brand";
		submitButton.textContent = "Submit";

		const form = settingFormNext();

		submitButton.addEventListener("click", async e => {
			Settings.data.manageContext = form.manageContext.value;
			await Settings.save();
			Modal.close();
			location.reload();
		});
		button.addEventListener("click", () => {
			Modal.render("Gladiator.tf Settings", form, submitButton);
		});

		node.prepend(button);
	}

	function isValidItem(item) {
		const unuWeaponIds = [701, 702, 703, 704];

		return (
			!item.texture &&
			!item.wearTear &&
			!unuWeaponIds.includes(item.particle?.id)
		);
	}

	function getItems() {
		const items = document.querySelectorAll(".item");
		let mappedItems = Array.from(items)
			.filter(item => isValidItem(item.__vue__._props.item))
			.map(item => ({
				name: item.__vue__._props.item.name,
				unpriced: !item.__vue__._props.item.price.community,
				quality: item.__vue__._props.item.quality.id
			}));

		if (Settings.data.isUnuOnlyChecked) {
			mappedItems = mappedItems.filter(item => item.quality === 5);
		}

		if (Settings.data.isKillstreakChecked) {
			mappedItems = mappedItems.flatMap(item => {
				if (!isWeapon(item.name)) {
					return [item];
				}

				return [
					item,
					...generateKillstreaks(item.name).map(name => ({
						name,
						unpriced: item.unpriced,
						quality: item.quality
					}))
				];
			});
		}

		return mappedItems;
	}

	function modifierCheckboxes() {
		const checkboxContainer = document.createElement("div");
		checkboxContainer.className = "d-flex flex-column gap-2";

		const ksCheckbox = createCheckbox(
			"add-ks",
			Settings.data.isKillstreakChecked,
			e => {
				Settings.data.isKillstreakChecked = e.target.checked;
				Settings.save();
			},
			" Add Killstreaks"
		);
		const unuOnlyCheckbox = createCheckbox(
			"add-unu",
			Settings.data.isUnuOnlyChecked,
			e => {
				Settings.data.isUnuOnlyChecked = e.target.checked;
				Settings.save();
			},
			" Add Unusuals Only"
		);
		checkboxContainer.appendChild(ksCheckbox);
		checkboxContainer.appendChild(unuOnlyCheckbox);

		return checkboxContainer;
	}

	function addPricelistButtonsNext(node) {
		const button = document.createElement("button");
		createGladiatorButton(button, "Add Current Page");

		button.addEventListener("click", () => {
			const items = getItems();

			bulkAdd(items.map(item => item.name));
		});
		const addAllCurrentPageButton = document.createElement("button");
		createGladiatorButton(addAllCurrentPageButton, "Add All");

		addAllCurrentPageButton.addEventListener("click", () => {
			PageState.paginating = true;
			const nextButton = document.querySelector(".p-paginator-next");
			if (nextButton) {
				nextButton.click();
			}
		});

		const checkboxContainer = modifierCheckboxes();

		const container = createButtonWrapperNext(
			[button, addAllCurrentPageButton, checkboxContainer],
			"p-1"
		);

		node.appendChild(container);
	}

	function handleListingTooltips(node) {
		const found = node.querySelector(
			".item-tooltip__content__suggested-value__long-price"
		);

		if (found) {
			const existing = found.querySelector(
				".glad-item-tooltip-container"
			);

			if (existing) return;

			const item = node.querySelector(".item-tooltip");

			const container = document.createElement("a");
			container.className = "glad-item-tooltip-container";

			const iconContainer = document.createElement("div");
			iconContainer.className = "glad-item-tooltip-logo-container";
			iconContainer.innerHTML = LOGO_SVG;

			container.append(iconContainer);

			const label = document.createElement("span");

			label.innerText = getAddLabel();
			label.className = "glad-item-tooltip-text";
			container.append(label);

			container.href = getAddLink(item.__vue__._props.item.name);
			container.target = "_blank";

			found.append(container);
		}
	}

	function addPrerendedButtonsNext() {
		if (PageState.currentPage === "stats") {
			const statsItem = document.querySelector(
				".card__content .header div"
			);

			if (statsItem) {
				addStatsButtonNext(statsItem);
			}
		} else if (
			PageState.currentPage === "items" ||
			PageState.currentPage === "effects"
		) {
			const itemsPage = document.querySelector(
				".card__content > .align-items-center"
			);
			if (itemsPage) {
				addAddAllButtonNext(itemsPage.parentNode);
			}
		} else if (PageState.currentPage === "pricelist") {
			const pricelistPage = document.querySelector(
				".card__content .container"
			);
			if (pricelistPage) {
				addPricelistButtonsNext(pricelistPage);
			}
		}
	}

	function addLinksNext() {
		addPrerendedButtonsNext();
		function navigationHandler(e) {
			const url = new URL(e?.destination?.url || window.location.href);
			computeCurrentPage(url.pathname);
		}

		function dropdownObserver(mutationsList) {
			for (const mutation of mutationsList) {
				if (mutation.type !== "childList") {
					continue;
				}

				for (const node of mutation.addedNodes) {
					if (node.classList?.contains("tippy-popper")) {
						handleListingTooltips(node);
						continue;
					}

					if (node.id === "content") {
						switch (PageState.currentPage) {
							case "pricelist":
								const container =
									node.querySelector(".container");
								if (container) {
									addPricelistButtonsNext(container);
								}
								break;
							case "items":
							case "effects":
								const itemsPage =
									node.querySelector(".card__content");
								if (itemsPage) {
									addAddAllButtonNext(itemsPage);
								}
								break;
						}
						continue;
					}

					if (
						PageState.currentPage === "stats" &&
						node.classList?.contains("align-items-start")
					) {
						const statsItem = node.parentNode;
						if (statsItem) {
							addStatsButtonNext(statsItem);
						}
					}

					// Dropdown
					if (node.classList?.contains("mission-control-wrapper")) {
						const right = node.querySelector(
							".mission-control__footer__right"
						);
						if (right) {
							addSettingsButtonNext(right);
						}
						continue;
					}

					// Listings
					if (node.role === "button") {
						let currentNode = node;
						let maxDepth = 10;
						while (
							currentNode.parentNode &&
							!currentNode.parentNode.classList?.contains(
								"listing"
							) &&
							maxDepth > 0
						) {
							currentNode = currentNode.parentNode;
							maxDepth--;
						}

						if (
							currentNode.parentNode &&
							currentNode.parentNode.classList?.contains(
								"listing"
							)
						) {
							handleListingNode(currentNode.parentNode);
						}
						continue;
					}
				}

				for (const node of mutation.removedNodes) {
					if (PageState.currentPage !== "pricelist") continue;
					const isLoadingOverlay = node.classList?.contains(
						"p-datatable-loading-overlay"
					);

					if (!isLoadingOverlay) {
						PageState.itemNames = itemNames;
						continue;
					}

					// Pricelist just finished loading current page.
					const items = getItems();
					const itemNames = items.map(item => item.name);
					if (PageState.paginating) {
						PageState.itemNames.push(...itemNames);
						const nextButton =
							document.querySelector(".p-paginator-next");

						if (nextButton.attributes.disabled) {
							LOGGER.info("Paginating complete");
							PageState.paginating = false;
							bulkAdd(PageState.itemNames);
							PageState.itemNames = [];
						} else if (nextButton) {
							nextButton.click();
						}
					}
				}
			}
		}
		if (typeof navigation !== "undefined") {
			navigation.addEventListener("navigate", navigationHandler);
		} else {
			// Firefox/Safari fallback
			window.addEventListener("popstate", navigationHandler);

			const originalPushState = history.pushState;
			const originalReplaceState = history.replaceState;

			history.pushState = function (...args) {
				originalPushState.apply(this, args);
				navigationHandler();
			};

			history.replaceState = function (...args) {
				originalReplaceState.apply(this, args);
				navigationHandler();
			};
		}

		new MutationObserver(dropdownObserver).observe(
			document.documentElement,
			{
				childList: true,
				attributes: true,
				subtree: true
			}
		);
	}

	function generateKillstreaks(baseName) {
		// copied from old script
		baseName = baseName
			.replace("Professional Killstreak ", "")
			.replace("Specialized Killstreak ", "")
			.replace("Killstreak ", "");

		let nonItemRegex = new RegExp(
			/(Non-Craftable)|(Unusual)|(Strange)|(Normal)|(Unique)|(Genuine)|(Vintage)|(Collector's) (Australium )?/g
		);

		let ks = [];
		let itemName = baseName.replace(nonItemRegex, "").trim();

		let nonItemName = baseName.replace(itemName, "");
		itemName = itemName.replace("The ", "");

		ks.push(`${nonItemName}Professional Killstreak ${itemName}`);
		ks.push(`${nonItemName}Specialized Killstreak ${itemName}`);
		ks.push(`${nonItemName}Killstreak ${itemName}`);
		return ks;
	}

	async function bulkAdd(itemNames) {
		const context = Settings.data.manageContext;
		let result;
		try {
			result = await gladiatorRequest(
				`/api/bots/${context}/items/add`,
				"POST",
				{
					"Content-Type": "application/json"
				},
				{ items: itemNames }
			);
		} catch (error) {
			Modal.render(
				"Failed to add items, check console for more details."
			);
			console.error("Failed to add items:", error);
			return;
		}
		const results = Object.entries(result.results);
		if (!results.length) {
			Modal.render("No items added, please check filters and try again.");
			return;
		}

		let failedAdds = [];

		results.forEach(result => {
			const [item, success] = result;

			if (!success) failedAdds.push(item);
		});

		const [botName] = Settings.getBotById(context);

		let msg =
			failedAdds.length === 0
				? `${results.length} items successfully added to ${botName}`
				: `Some items failed to be added (${
						results.length - failedAdds.length
				  }/${results.length} Successful):<br> ${failedAdds.join(
						"<br>"
				  )}`;

		Modal.render("Adding Items", msg);
	}

	async function gladiatorRequest(path, method, headers, json) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: method,
				url: `${API_URL}${path}`,
				headers: headers,
				data: JSON.stringify(json),
				onload: function (data) {
					const response = JSON.parse(data.responseText);
					if (!response.success) {
						reject(new Error(response.error || "Unknown Error"));
						return;
					}

					resolve(response);
				},
				onerror: function (err) {
					reject(err);
				}
			});
		});
	}

	async function getBots() {
		if (Settings.data.lastCache > Date.now() - BOTS_TTL) {
			const existing = Settings.data.bots;

			LOGGER.info("Using cached bots");
			return existing;
		}

		const bots = await fetchBots();

		Settings.data.bots = bots;
		Settings.data.lastCache = Date.now();

		await Settings.save();
	}

	async function fetchBots() {
		const data = await gladiatorRequest("/api/bots/my", "GET");
		return data.bots;
	}

	function isWeapon(name) {
		name = new String(name);

		if (name.includes("Kit") || name.includes("Fabricator")) return false;
		return WEAPONS.some(weapon => {
			return name.includes(weapon);
		});
	}
})();
