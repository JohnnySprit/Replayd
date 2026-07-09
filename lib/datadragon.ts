export async function getVersions(): Promise<string[]> {
    const versions = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
    const versionsData = await versions.json();
    return versionsData
}

export async function getItemNames(version: string): Promise<Record<string, string>> {
        const itemNames = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`);
        const itemNamesData = await itemNames.json();
        return Object.fromEntries(
            Object.entries(itemNamesData.data)
            .map(([key, value]: [string, any]) => [key, value.name]))
}