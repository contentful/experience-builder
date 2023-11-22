// USAGE:
//  - place into project directory
//  - edit line 11 and set correct path to `package.json`
//  - change build command from "vite build" to "node bump-alpha.cjs && vite build"


'use strict';
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, './package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath));
const oldVersionString = pkg.version;

const version = versionFromString(pkg.version);

version.alphaBuild++;
const newVersionString = versionToString(version);
pkg.version = newVersionString;
console.log(`Bumping package.json['version']: ${oldVersionString} -> ${newVersionString}`);
fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');


/**
 * Parses version in format 0.0.1-alpha-16
 * @param {string} versionString
 * @return {{
 *  major: number,
 *  minor: number,
 *  patch: number,
 *  alpha: string,
 *  alphaBuild: number,
 * }}
 */
function versionFromString(versionString){

    // @see https://regex101.com/r/V51q1L/1
    const regex = /(\d+)[.](\d+)[.](\d+)[-]([^-]+)[-](\d+)/;

    console.log('HEEEERE', {versionString});
    const matches = versionString.match(regex);

    console.log({matches});
    if ( null === matches){
        throw new Error(`Cannot parse version string '${versionString} via regex [${regex.toString()}]`);
    }

    return {
        major: parseInt(matches[1], 10),
        minor: parseInt(matches[2], 10),
        patch: parseInt(matches[3], 10),
        alpha: matches[4],
        alphaBuild: parseInt(matches[5], 10),
    }
}


/**
 *
 * @param {{
 *  major: number,
 *  minor: number,
 *  patch: number,
 *  alpha: string,
 *  alphaBuild: number,
 * }} version
 * @returns {string} in format '0.0.1-alpha-16'
 */
function versionToString({ major , minor, patch, alpha, alphaBuild }){
    return `${major}.${minor}.${patch}-${alpha}-${alphaBuild}`;
}