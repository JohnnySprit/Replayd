

export function toDataDragonVersion(version: string): string {
    const versionParts = version.split(".")
    return versionParts[0] + "." + versionParts[1] + ".1"
}

let cachedItems: Record<string, string> | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION_MS = 1000 * 60 * 60 * 24 //24 hours

export async function getItemNames(version: string): Promise<Record<string, string>> {

    const now = Date.now()

    const isCacheValid = cachedItems && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION_MS)

    if (isCacheValid) {
        return cachedItems!
    }

    const itemNames = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`);
    const itemNamesData = await itemNames.json();
    cachedItems = Object.fromEntries(
        Object.entries(itemNamesData.data)
            .map(([key, value]: [string, any]) => [key, value.name]))
    cacheTimestamp = now
    return cachedItems!
}
