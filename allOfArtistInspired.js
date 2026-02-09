(async function allOfArtistInspired() {
	if (!(Spicetify.React && Spicetify.ReactDOM && Spicetify.Platform)) {
		setTimeout(allOfArtistInspired, 300);
		return;
	}

	const { React } = Spicetify;
	const { useState } = React;

	const CONFIG_KEY = "allOfArtistInspired:settings";
	const DEFAULT_CONFIG = {
		includeSingles: true,
		includeEPs: true,
		includeCompilations: false,
		includeAppearsOn: true,
		includeAltVersions: false,
		includeUnplayable: false,
		dedupePlaylist: false,
		dedupePriority: "priority-album", // album | single | oldest | newest
		sortOrder: "newest-oldest", // newest-oldest | oldest-newest
		playlistLimit: 10000, // 100 | 1000 | 2000 | 5000 | 10000
		setCustomCover: true,
		isPublicPlaylist: false,
	};

	function loadConfig() {
		try {
			const parsed = JSON.parse(Spicetify.LocalStorage.get(CONFIG_KEY));
			if (parsed && typeof parsed === "object") {
				return parsed;
			}
			throw "";
		} catch {
			Spicetify.LocalStorage.set(CONFIG_KEY, "{}");
			return DEFAULT_CONFIG;
		}
	}

	const CONFIG = loadConfig();
	saveConfig();

	function saveConfig() {
		Spicetify.LocalStorage.set(CONFIG_KEY, JSON.stringify(CONFIG));
	}

	function openSettings() {
		const style = React.createElement(
			"style",
			null,
			`
			.setting-row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 16px 0;
			}
			.setting-row .col.description {
				max-width: 70%;
			}
			.setting-row .col.action {
				float: right;
				text-align: right;
			}
			button.switch {
				align-items: center;
				border: 0px;
				border-radius: 50%;
				background-color: rgba(var(--spice-rgb-shadow), .7);
				color: var(--spice-text);
				cursor: pointer;
				display: flex;
				margin-inline-start: 12px;
				padding: 8px;
			}
			button.switch.disabled,
			button.switch[disabled] {
				color: rgba(var(--spice-rgb-text), .3);
			}
			.setting-subtitle {
				font-size: 11px;
				opacity: 0.6;
			}
			select {
				color: var(--spice-text);
				background: rgba(var(--spice-rgb-shadow), 0.7);
				border: 0;
				height: 32px;
				padding: 0 8px;
			}
			`,
		);

		function header(title) {
			return React.createElement("h3", null, title);
		}

		function DisplayIcon({ icon, size }) {
			return React.createElement("svg", {
				width: size,
				height: size,
				viewBox: "0 0 16 16",
				fill: "currentColor",
				dangerouslySetInnerHTML: {
					__html: icon,
				},
			});
		}

		function checkButton({name, field, subtitle = "", onChange = () => {}}) {
			const [value, setValue] = useState(CONFIG[field]);

			const handleClick = () => {
				CONFIG[field] = !value;
				setValue(!value);
				saveConfig();
				onChange(!value);
			};

			return React.createElement(
				"div",
				{ className: "setting-row" },
				React.createElement(
					"div",
					{ className: "col description" },
					React.createElement("div", null, name),
					subtitle &&
						React.createElement(
							"div",
							{ className: "setting-subtitle" },
							subtitle,
						),
				),
				React.createElement(
					"div",
					{ className: "col action" },
					React.createElement(
						"button",
						{
							className: `switch${value ? "" : " disabled"}`,
							onClick: handleClick,
						},
						React.createElement(DisplayIcon, {
							icon: Spicetify.SVGIcons.check,
							size: 16,
						}),
					),
				),
			);
		}

		function dropdownButton({name, field, options, disabled = false, onChange = () => {}}) {
			const [value, setValue] = useState(CONFIG[field]);

			const handleChange = (e) => {
				CONFIG[field] = e.target.value;
				setValue(e.target.value);
				saveConfig();
				onChange(e.target.value);
			};

			return React.createElement(
				"div",
				{ className: "setting-row" },
				React.createElement(
					"label",
					{ className: "col description" },
					name,
				),
				React.createElement(
					"div",
					{ className: "col action" },
					React.createElement(
						"select",
						{ value, onChange: handleChange, disabled },
						options.map((opt) =>
							React.createElement(
								"option",
								{ key: opt.value, value: opt.value },
								opt.label,
							),
						),
					),
				),
			);
		}

		const settingsDOMContent = () => {
			const [dedupeEnabled, setDedupeEnabled] = useState(CONFIG.dedupePlaylist);
			const handleDedupeToggle = (state) => { setDedupeEnabled(state) };

			return React.createElement(
				"div",
				null,
				style,

				header("Inclusions"),
				React.createElement(checkButton, {
					name: "Include singles",
					field: "includeSingles",
				}),
				React.createElement(checkButton, {
					name: "Include EPs",
					field: "includeEPs",
					subtitle: "Only EPs that's not an alternate version.",
				}),
				React.createElement(checkButton, {
					name: "Include compilations",
					field: "includeCompilations",
				}),
				React.createElement(checkButton, {
					name: "Include appearances",
					field: "includeAppearsOn",
					subtitle: `Tracks from "Various Artists" are not considered.`,
				}),
				React.createElement(checkButton, {
					name: "Include alternate versions",
					field: "includeAltVersions",
					subtitle: "Live, remixes, sped up versions, etc.",
				}),
				React.createElement(checkButton, {
					name: "Include unplayable tracks",
					field: "includeUnplayable",
					subtitle: "Note: It does not add tracks from albums removed in the artist section.",
				}),

				header("Deduplication"),
				React.createElement(checkButton, {
					name: "Dedupe tracks",
					field: "dedupePlaylist",
					onChange: handleDedupeToggle,
				}),
				React.createElement(dropdownButton, {
					name: "Track priority",
					field: "dedupePriority",
					options: [
						{ value: "priority-album", label: "Prefer Album ver." },
						{ value: "priority-single", label: "Prefer Single ver." },
						{ value: "priority-oldest", label: "Oldest release" },
						{ value: "priority-newest", label: "Newest release" },
					],
					disabled: !dedupeEnabled,
				}),

				header("Playlist"),
				React.createElement(dropdownButton, {
					name: "Sort order",
					field: "sortOrder",
					options: [
						{ value: "newest-oldest", label: "Newest to Oldest" },
						{ value: "oldest-newest", label: "Oldest to Newest" },
					],
				}),
				React.createElement(dropdownButton, {
					name: "Limit per playlist",
					field: "playlistLimit",
					options: [
						{ value: 100, label: "100" },
						{ value: 1000, label: "1000" },
						{ value: 2000, label: "2000" },
						{ value: 5000, label: "5000" },
						{ value: 10000, label: "10000" }, // Spotify's max. limit!
					],
				}),
				React.createElement(checkButton, {
					name: "Set custom cover",
					field: "setCustomCover",
					subtitle: "Use artist's avatar as playlist cover.",
				}),
				React.createElement(checkButton, {
					name: "Make playlist public",
					field: "isPublicPlaylist",
					subtitle: "Only playlists that you make after changing this setting will be affected.",
				}),
			);
		};

		Spicetify.PopupModal.display({
			title: "All Of Artist Settings",
			content: React.createElement(settingsDOMContent),
		});
	}

	new Spicetify.Menu.Item(
		"All Of Artist Settings",
		false,
		openSettings,
		"artist",
	).register();

	new Spicetify.ContextMenu.Item(
		"Create all of artist",
		(u) => createDiscographyPlaylist(u[0]),
		(t) => Spicetify.URI.isArtist(t[0]),
		"artist",
	).register();

	async function fetchInternalMetadata(uri) {
		const id = Spicetify.URI.fromString(uri).id;
		const type = Spicetify.URI.fromString(uri).type;
		const hex = Spicetify.URI.idToHex(id);

		try {
			const metadata = await Spicetify.Platform.RequestBuilder.build()
				.withHost("https://spclient.wg.spotify.com/metadata/4")
				.withPath(`/${type}/${hex}`)
				.send();
			if (!metadata.ok) return null;

			const body = await metadata.body;
			if (!body) return null;

			return {
				artists: body.artist,
				canonicalUri: body.canonical_uri,
				date: body.date ?? null,
				name: body.name,
				type: body.type ?? null,
				versionTitle: body.version_title || "",
			};
		} catch (e) {
			console.error(`[all-of-artist-inspired] Failed to fetch ${type} internal metadata:`, e);
			return null;
		}
	}

	const formattedDate = (dateObj) => {
		if (!dateObj?.year) return 0;

		const year = dateObj.year;
		const month = dateObj.month ? dateObj.month - 1 : 0;
		const day = dateObj.day || 1;
		return new Date(year, month, day).getTime();
	}

	function deduplicateTracksIfNeeded(tracks) {
		if (!CONFIG.dedupePlaylist) return tracks;

		const getTypeWeight = (type) => {
			const t = type.toUpperCase();
			if (t === "ALBUM") return 4;
			if (t === "SINGLE") return 3;
			return 2;
		};

		const groupMap = new Map();
		for (const track of tracks) {
			const key = track.canonicalUri || track.uri;
			if (!groupMap.has(key)) groupMap.set(key, []);

			groupMap.get(key).push(track);
		}

		const uniqueTracks = [];
		for (const group of groupMap.values()) {
			if (group.length === 1) {
				uniqueTracks.push(group[0]);
				continue;
			}

			group.sort((a, b) => {
				const typeA = getTypeWeight(a.album.type);
				const typeB = getTypeWeight(b.album.type);

				const dateA = formattedDate(a.album.releaseDate);
				const dateB = formattedDate(b.album.releaseDate);

				switch (CONFIG.dedupePriority) {
					case "priority-album":
						if (typeA !== typeB) return typeB - typeA;
						return dateA - dateB; // Oldest release

					case "priority-single":
						const sTypeA = a.album.type === "SINGLE" ? 10 : typeA;
						const sTypeB = b.album.type === "SINGLE" ? 10 : typeB;
						if (sTypeA !== sTypeB) return sTypeB - sTypeA;
						return dateA - dateB; // Oldest release

					case "priority-newest":
						if (dateA !== dateB) return dateB - dateA;
						return typeB - typeA; // Album type

					case "priority-oldest":
						if (dateA !== dateB) return dateA - dateB;
						return typeB - typeA; // Album type

					default:
						return 0;
				}
			});

			uniqueTracks.push(group[0]);
		}

		const finalUniqueTracks = [];
		const toIndex = new Map();
		for (const t of uniqueTracks) {
			const tObj = JSON.stringify([
				t.name.toLowerCase(),
				t.album.name.toLowerCase(),
				t.album.artistUris,
				t.duration,
			]);

			if (!toIndex.has(tObj)) {
				toIndex.set(tObj, finalUniqueTracks.length);
				finalUniqueTracks.push(t);
			} else {
				const i = toIndex.get(tObj);
				const existing = finalUniqueTracks[i];

				if (t.playCount > existing.playCount) finalUniqueTracks[i] = t;
			}
		}

		return finalUniqueTracks;
	}

	async function fetchDiscography(artistId, type) {
		const artistUri = `spotify:artist:${artistId}`;
		const { queryArtistDiscographyAlbums, queryArtistDiscographySingles, queryArtistDiscographyCompilations } = Spicetify.GraphQL.Definitions;

		const DEFINITIONS_MAP = {
			albums: queryArtistDiscographyAlbums,
			compilations: queryArtistDiscographyCompilations,
			singles: queryArtistDiscographySingles,
		};
		const definition = DEFINITIONS_MAP[type];
		const order = CONFIG.sortOrder === "newest-oldest" ? "DATE_DESC" : "DATE_ASC";

		const albumUris = [];
		let offset = 0;
		const limit = 100;
		let hasNextPage = true;

		while (hasNextPage) {
			const { errors, data } = await Spicetify.GraphQL.Request(
				definition, {
					uri: artistUri,
					limit: limit,
					offset: offset,
					order: order
				}
			);
			if (errors) throw `${type}: ${errors[0].message}`;

			const disc = data.artistUnion.discography[type];
			if (!disc) break;

			for (const group of disc.items) {
				const releases = group.releases?.items || [];
				for (const release of releases) {
					albumUris.push(`spotify:album:${release.id}`);
				}
			}

			offset += limit;
			hasNextPage = offset < disc.totalCount;
		}

		return albumUris;
	}

	async function fetchAppearsOn(artistId) {
		const artistUri = `spotify:artist:${artistId}`;
		const { queryArtistAppearsOn } = Spicetify.GraphQL.Definitions;

		const albumUris = [];
		let offset = 0;
		const limit = 100;
		let hasNextPage = true;

		while (hasNextPage) {
			const { errors, data } = await Spicetify.GraphQL.Request(
				queryArtistAppearsOn,
				{
					uri: artistUri,
					limit: limit,
					offset: offset
				}
			);
			if (errors) throw `appearsOn: ${errors[0].message}`;

			const appearsOn = data.artistUnion.relatedContent.appearsOn;
			if (!appearsOn) break;

			for (const group of appearsOn.items || []) {
				const releases = group.releases?.items || [];
				for (const release of releases) {
					albumUris.push(`spotify:album:${release.id}`);
				}
			}

			offset += limit;
			hasNextPage = offset < appearsOn.totalCount;
		}

		return albumUris;
	}

	async function fetchAlbumsMetadata(albumUris, type) {
		const ALBUMS_META_BATCH_SIZE = 50;
		const VARIOUS_ARTISTS_URI = "spotify:artist:0LyfQWJT6nXafLPZqxe9Of";
		const albumsMetadata = [];

		for (let i = 0; i < albumUris.length; i += ALBUMS_META_BATCH_SIZE) {
			const batch = albumUris.slice(i, i + ALBUMS_META_BATCH_SIZE);

			await Promise.all(
				batch.map(async (albumUri) => {
					const albumMeta = await fetchInternalMetadata(albumUri);
					if (!albumMeta) return;

					if (!CONFIG.includeEPs && type === "singles" && albumMeta.type === "EP") return;
					if (!CONFIG.includeSingles && type === "singles" && albumMeta.type === "SINGLE") return;
					if (!CONFIG.includeAltVersions && type !== "appearsOn" && albumMeta.versionTitle.length > 0) return;

					const artistUris = (albumMeta.artists || []).map(a =>
						`spotify:artist:${Spicetify.URI.hexToId(a.gid)}`
					);

					if (albumMeta.type === "COMPILATION" && artistUris.includes(VARIOUS_ARTISTS_URI)) return;

					albumsMetadata.push({
						uri: albumUri,
						artistUris: artistUris.join(","),
						name: albumMeta.name,
						releaseDate: albumMeta.date,
						type: albumMeta.type,
						versionTitle: albumMeta.versionTitle,
					});
				})
			);
		}

		return albumsMetadata;
	}

	async function fetchAlbumTracks(albumUri, artistId) {
		const { queryAlbumTracks } = Spicetify.GraphQL.Definitions;
		const { errors, data } = await Spicetify.GraphQL.Request(
			queryAlbumTracks,
			{
				uri: albumUri,
				limit: 100,
				offset: 0
			}
		);

		if (errors) throw `queryAlbumTracks: ${errors[0].message}`;
		if (data.albumUnion.playability.playable === false) throw "Unplayable album.";

		return (data.albumUnion?.tracksV2 ?? data.albumUnion?.tracks ?? []).items
			.map(({ track }) => track)
			.filter(track =>
				(track.artists.items || []).some(a => Spicetify.URI.fromString(a.uri).id === artistId) &&
				(CONFIG.includeUnplayable || track.playability.playable)
			);
	}

	async function fetchTracks(albumsMetadata, artistId) {
		const TRACKS_BATCH_SIZE = 50;
		const trackMap = new Map();

		for (let i = 0; i < albumsMetadata.length; i += TRACKS_BATCH_SIZE) {
			const batch = albumsMetadata.slice(i, i + TRACKS_BATCH_SIZE);

			await Promise.all(
				batch.map(async (album) => {
					const tracks = await fetchAlbumTracks(album.uri, artistId);

					for (const track of tracks) {
						trackMap.set(track.uri, {
							uri: track.uri,
							album: album,
							artists: track.artists,
							name: track.name,
							discNumber: parseInt(track.discNumber, 10) || 0,
							trackNumber: parseInt(track.trackNumber, 10) || 0,
							duration: track.duration.totalMilliseconds,
							playCount: Number(track.playcount || 0),
						});
					}
				})
			);
		}

		return Array.from(trackMap.values());
	}

	async function fetchTracksMetadata(albumTracks) {
		const TRACKS_META_BATCH_SIZE = 50;
		const tracksMetadata = [];

		for (let i = 0; i < albumTracks.length; i += TRACKS_META_BATCH_SIZE) {
			const batch = albumTracks.slice(i, i + TRACKS_META_BATCH_SIZE);

			await Promise.all(
				batch.map(async (track) => {
					const trackMeta = await fetchInternalMetadata(track.uri);

					if (!trackMeta) return;
					if (!CONFIG.includeAltVersions && trackMeta.versionTitle.length > 0) return;

					tracksMetadata.push({
						...track,
						canonicalUri: trackMeta.canonicalUri,
						versionTitle: trackMeta.versionTitle,
					});
				})
			);
		}

		return tracksMetadata;
	}

	async function fetchAlbumTracksMetadataByType(artistId, type) {
		let allAlbumUris = [];

		if (type === "appearsOn") {
			allAlbumUris = await fetchAppearsOn(artistId);
		} else {
			allAlbumUris = await fetchDiscography(artistId, type);
		}

		const albumsMetadata = await fetchAlbumsMetadata(allAlbumUris, type);
		const albumTracks = await fetchTracks(albumsMetadata, artistId);
		const tracksMetadata = await fetchTracksMetadata(albumTracks);

		return tracksMetadata;
	}

	async function fetchArtistSortedTracks(artistId) {
		let tracks = [];
		const albumTracks = await fetchAlbumTracksMetadataByType(artistId, "albums");

		tracks.push(...albumTracks);
		if (CONFIG.includeSingles || CONFIG.includeEPs) tracks.push(...(await fetchAlbumTracksMetadataByType(artistId, "singles")));
		if (CONFIG.includeCompilations) tracks.push(...(await fetchAlbumTracksMetadataByType(artistId, "compilations")));
		if (CONFIG.includeAppearsOn) tracks.push(...(await fetchAlbumTracksMetadataByType(artistId, "appearsOn")));

		tracks = await deduplicateTracksIfNeeded(tracks);

		tracks.sort((a, b) => {
			const dateA = formattedDate(a.album.releaseDate);
			const dateB = formattedDate(b.album.releaseDate);

			const dateRelease = CONFIG.sortOrder === "newest-oldest" ? dateB - dateA : dateA - dateB;
			if (dateRelease !== 0) return dateRelease;

			const albumA = a.album.name.toLowerCase();
			const albumB = b.album.name.toLowerCase();

			const albumCompare = albumA.localeCompare(albumB);
			if (albumCompare !== 0) return albumCompare;

			const discCompare = a.discNumber - b.discNumber;
			if (discCompare !== 0) return discCompare;

			return a.trackNumber - b.trackNumber;
		});

		return { trackUris: tracks.map((t) => t.uri), albumTrackCount: albumTracks.length };
	}

	async function fetchArtistInfo(artistId) {
		const { errors, data } = await Spicetify.GraphQL.Request(
			Spicetify.GraphQL.Definitions.queryArtistOverview,
			{ uri: `spotify:artist:${artistId}` },
		);
		if (errors) throw `queryArtistOverview: ${errors[0].message}`;

		const name = data.artistUnion.profile.name;
		const imgSrc = data.artistUnion.visuals?.avatarImage?.sources;

		if (!imgSrc || imgSrc.length === 0) return { name, imgUrl: null };

		const best = imgSrc.reduce((prev, curr) => prev.width > curr.width ? prev : curr);
		return { name, imgUrl: best.url };
	}

	async function fetchImageAsBase64(imgUrl) {
		const imgRes = await fetch(imgUrl);
		const imgBlob = await imgRes.blob();
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(imgBlob);
		});
	}

	async function setPlaylistCover(playlistUri, b64Img) {
		const playlistId = Spicetify.URI.fromString(playlistUri).id;
		const bufferToHex = (buffer) =>
			Array.from(new Uint8Array(buffer))
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");

		const getFileFromBase64 = async (b64) => {
			const res = await fetch(b64);
			const blob = await res.blob();
			return new File([blob], "cover.jpg", { type: "image/jpeg" });
		};

		const file = await getFileFromBase64(b64Img);
		const sessionToken = Spicetify.Platform.Session.accessToken;
		const uploadToken = await Spicetify.Platform.PlaylistAPI.uploadImage(file);

		if (!uploadToken) throw "Custom cover upload failed: No token returned.";

		const regRes = await fetch(
			`https://spclient.wg.spotify.com/playlist/v2/playlist/${playlistId}/register-image`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${sessionToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ uploadToken }),
			},
		);

		if (!regRes.ok) throw `Custom cover registration failed: ${regRes.status}`;

		const buffer = await regRes.arrayBuffer();
		const hexBuffer = bufferToHex(buffer);

		await Spicetify.Platform.PlaylistAPI.setAttributes(playlistUri, { picture: hexBuffer.slice(4) });

		if (typeof Spicetify.Platform.PlaylistAPI.resync === "function") {
			await Spicetify.Platform.PlaylistAPI.resync(playlistUri);
		}
	}

	async function setPlaylistVisibility(playlistUri) {
		const settings = CONFIG.isPublicPlaylist ? "VIEWER" : "BLOCKED";
		await Spicetify.Platform.PlaylistPermissionsAPI.setBasePermission(playlistUri, settings);
	}

	async function updatePlaylistDescription(playlistUri, albumTrackCount, artistName) {
		const parts = [];

		if (albumTrackCount > 0) parts.push("album releases");
		if (CONFIG.includeSingles) parts.push("singles");
		if (CONFIG.includeEPs) parts.push("EPs");
		if (CONFIG.includeCompilations) parts.push("compilations");
		if (CONFIG.includeAppearsOn) parts.push("appearances");

		const desc =
			parts.length === 0
				? "": `Includes ${
					parts.length === 1
					? parts[0]
					: parts.length === 2
					? parts.join(" and ")
					: `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}`
				} of ${artistName}. Created with all-of-artist by cvius.`;

		await Spicetify.Platform.PlaylistAPI.updateDetails(playlistUri, { description: desc });
	}

	async function getExistingPlaylistNames(baseName, playlists) {
		const rootlist = await Spicetify.Platform.RootlistAPI.getContents();
		const existingNames = rootlist.items
			.filter((item) => item.type === "playlist")
			.map((item) => item.name);

		const escaped = baseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const regExp = new RegExp(`^${escaped}(?: \\((\\d+)\\))?$`);

		let maxNumber = 0;

		for (const name of existingNames) {
			const match = name.match(regExp);
			if (!match) continue;

			const num = match[1] ? parseInt(match[1], 10) : 1;
			maxNumber = Math.max(maxNumber, num);
		}

		const names = [];
		const startNumber = maxNumber === 0 ? 1 : maxNumber + 1;
		for (let i = 0; i < playlists; i++) {
			if (startNumber === 1 && i === 0) {
				names.push(baseName);
			} else {
				names.push(`${baseName} (${startNumber + i})`);
			}
		}

		return names;
	}

	async function createDiscographyPlaylist(artistUri) {
		const artistId = Spicetify.URI.fromString(artistUri).id;
		const { name: artistName, imgUrl: artistImageUrl } = await fetchArtistInfo(artistId);
		const baseName = `All of ${artistName}`;

		Spicetify.showNotification(`Creating ${baseName}...`);

		try {
			const { trackUris: allTracks, albumTrackCount } = await fetchArtistSortedTracks(artistId);
			if (allTracks.length === 0) {
				Spicetify.showNotification(`No tracks found for ${artistName}.`, true);
				return;
			}

			const TRACKS_BATCH_SIZE = 100;
			const PLAYLIST_LIMIT_SIZE = CONFIG.playlistLimit;
			const playlists = Math.ceil(allTracks.length / PLAYLIST_LIMIT_SIZE);
			const playlistNames = await getExistingPlaylistNames(baseName, playlists);
			const coverBase64 = CONFIG.setCustomCover ? await fetchImageAsBase64(artistImageUrl) : null;

			for (let i = 0; i < playlists; i++) {
				const batchTracks = allTracks.slice(i * PLAYLIST_LIMIT_SIZE, (i + 1) * PLAYLIST_LIMIT_SIZE);
				const playlistName = playlistNames[i];
				const playlistUri = await Spicetify.Platform.RootlistAPI.createPlaylist(playlistName, { before: "start" });

				await Promise.all([
					setPlaylistVisibility(playlistUri),
					updatePlaylistDescription(playlistUri, albumTrackCount, artistName),
				]);

				if (coverBase64) {
					try {
						await setPlaylistCover(playlistUri, coverBase64);
					} catch (e) {
						console.warn("Cover upload failed, continuing without custom cover.", e);
					}
				}
				for (let j = 0; j < batchTracks.length; j += TRACKS_BATCH_SIZE) {
					await Spicetify.Platform.PlaylistAPI.add(
						playlistUri,
						batchTracks.slice(j, j + TRACKS_BATCH_SIZE),
						{ after: "end" },
					);
				}

				await new Promise((t) => setTimeout(t, 1000));
			}

			Spicetify.showNotification(`${baseName} created.`);
		} catch (e) {
			Spicetify.showNotification(`Failed to create ${baseName}`, true);
			console.error("[all-of-artist-inspired]", e);
		}
	}
})();
