# All of Artist X

Create a complete playlist of your favorite artist’s discography — curated and organized exactly how you want.

Your playlist, your preference.

> If you find this extension useful, consider giving it a star ⭐️. Thank you!

## Requirements

- **Spotify:** 1.2.79 or higher (recommended) 
- **Spicetify:** Latest

> [!WARNING]
> I haven't tested it on lower versions of Spotify. If it doesn’t work there, I won’t be able to provide support. However, pull requests are welcome.

## Installation

### 1. Using [Marketplace](https://github.com/spicetify/spicetify-marketplace)

1.  Go to Marketplace
2.  Search `All of Artist X` under "Extensions" tab
3.  Click the **Install** button for "All of Artist X"
4.  Reload Spotify. Done!

> If you can't see the extension in marketplace, just click "Load more"

### 2. Manual Installation
Copy `allOfArtistXLoader.mjs` into your [Spicetify](https://github.com/spicetify/spicetify-cli) extensions directory:

| **Platform** | **Path**                                                                             |
| ------------ | ------------------------------------------------------------------------------------ |
| **Linux**    | `~/.config/spicetify/Extensions` or `$XDG_CONFIG_HOME/.config/spicetify/Extensions/` |
| **MacOS**    | `~/.config/spicetify/Extensions` or `$SPICETIFY_CONFIG/Extensions`                   |
| **Windows**  | `%appdata%/spicetify/Extensions/`                                                    |

After putting the extension file into the correct folder, run the following command to install the extension:

```bash
spicetify config extensions allOfArtistXLoader.mjs
spicetify apply
```

Or you can manually edit your `config-xpui.ini` file. Add your desired extension filenames in the extensions key, separated them by the `|` character.
Example:

```ini
[AdditionalOptions]
...
extensions = autoSkipExplicit.js|shuffle+.js|trashbin.js|allOfArtistXLoader.mjs
```

Then run:

```bash
spicetify apply
```

## Uninstallation

Run the following command to uninstall the extension (note the - on the end):

```bash
spicetify config extensions allOfArtistXLoader.mjs-
spicetify apply
```

You can also manually edit your `config-xpui.ini` file. Just remove the extension's filename completely.
Example:

```ini
[AdditionalOptions]
...
extensions = autoSkipExplicit.js|shuffle+.js|trashbin.js
```

Then run:

```bash
spicetify apply
```
## Usage

Right-click an artist's name, and you'll have an option to "👤 Create all of artist"

You can also find the option if you click the three dots (More options) when you're at your favorite artist's page.

<div><img src='assets/menu.png' width=360></div>

## Settings

Click on your profile at the top-right corner and click "👤 All of Artist X Settings"

> [!NOTE]
>  Some settings have a description under their title. It's important you read them.

### ➕ Inclusions

Allows you to choose which tracks to add to your favorite artist's dedicated playlist.

- **Include singles:** Whether you want an artist's `Single` releases to be added or not. [Default: **On**].
- **Include EPs:** Whether you want an artist's `EPs` ([Extended Play](https://en.wikipedia.org/wiki/Extended_play)) to be added or not. [Default: **On**]
- **Include compilations:** Whether you want an artist's `Compilation` to be added or not. (Usually, these contains the artist's greatest hits defined by the artist itself and/or the record label.) [Default: **Off**]
- **Include appearances:** Whether you want an artist's featured songs that is ***not*** on the artist's discography to be added or not. (These can be found in `Appears On` section.) [Default: **On**]
- **Include alternate version:** Whether you want tracks' live versions, remixes, sped up version, etc. to be added or not. (Alternate versions are defined by Spotify.) [Default: **Off**]
- **Include unplayable tracks:** Whether you want an artist's unplayable songs to be added or not. [Default: **Off**]

### 🗑️ Deduplication

Automatically identify and remove duplicate tracks that suits your track prioritization setting.

- **Dedupe tracks:** Whether you want to automatically remove duplicate tracks or not. [Default: **Off**]
- **Track priority:** Determines which tracks to prioritize when removing duplicates. [Default: **Prefer Album ver.**]

### ☰ Playlist

Allows you to customize the creation of your favorite artist's playlist. 

- **Sort order:** Determines the order of how tracks will be sorted inside the playlist. [Default: **Newest to oldest**]
- **Limit per playlist:** Determines how many tracks each artist's playlist will have. It will automatically create another playlist when it hits the limit. [Default: **10,000**]
- **Set custom cover:** Whether to automatically set the artist's profile picture as playlist cover. [Default: **On**]
- **Make playlist public:** Whether to automatically set the playlist created as public or private playlist. [Default: **Off**]

<div><img src='assets/settings.png' width=360></div>

## FAQs
- "Are you going to add more sort order?"

**No.**

- "There are X tracks added even tho I set Y to Z."

**Blame Spotify.** This extension relies solely on Spotify’s metadata, which this extension does not control. If you're experiencing an issue or have a suggestion, please create one [here](https://github.com/cvius/all-of-artist-inspired/issues/new/choose).

- "How does deduplication works?"

This extension uses [`canonical_uri`](https://en.wikipedia.org/wiki/Canonicalization) instead of [ISRC IDs](https://en.wikipedia.org/wiki/International_Standard_Recording_Code) to ensure duplicate identification as some tracks do not have ISRCs. It groups matching tracks together and selects the one that best fits your preferences.

## Acknowledgements

This extension was inspired by and built with the help of ideas and code from several extensions:

- [**allOfArtist**](https://github.com/pl4neta/allOfArtist) by pl4neta
- [**sort-play**](https://github.com/hoeci/sort-play) by hoeci
- [**shuffle+**](https://spicetify.app/docs/customization/extensions/#shuffle) by khanhas and Tetrax-10 
