/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/code/electron-browser/issue/issueReporterModel", "vs/code/electron-browser/issue/issueReporterUtil"], function (require, exports, assert, issueReporterModel_1, issueReporterUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('IssueReporter', () => {
        test('sets defaults to include all data', () => {
            const issueReporterModel = new issueReporterModel_1.IssueReporterModel();
            assert.deepEqual(issueReporterModel.getData(), {
                allExtensions: [],
                includeSystemInfo: true,
                includeWorkspaceInfo: true,
                includeProcessInfo: true,
                includeExtensions: true,
                includeSearchedExtensions: true,
                includeSettingsSearchDetails: true,
                issueType: 0
            });
        });
        test('serializes model skeleton when no data is provided', () => {
            const issueReporterModel = new issueReporterModel_1.IssueReporterModel({});
            assert.equal(issueReporterModel.serialize(), `
Issue Type: <b>Bug</b>

undefined

VS Code version: undefined
OS version: undefined

Extensions: none
<!-- generated by issue reporter -->`);
        });
        test('serializes GPU information when data is provided', () => {
            const issueReporterModel = new issueReporterModel_1.IssueReporterModel({
                issueType: 0,
                systemInfo: {
                    os: 'Darwin',
                    cpus: 'Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)',
                    memory: '16.00GB',
                    vmHint: '0%',
                    processArgs: '',
                    screenReader: 'no',
                    remoteData: [],
                    gpuStatus: {
                        '2d_canvas': 'enabled',
                        'checker_imaging': 'disabled_off'
                    }
                }
            });
            assert.equal(issueReporterModel.serialize(), `
Issue Type: <b>Bug</b>

undefined

VS Code version: undefined
OS version: undefined

<details>
<summary>System Info</summary>

|Item|Value|
|---|---|
|CPUs|Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)|
|GPU Status|2d_canvas: enabled<br>checker_imaging: disabled_off|
|Load (avg)|undefined|
|Memory (System)|16.00GB|
|Process Argv||
|Screen Reader|no|
|VM|0%|
</details>Extensions: none
<!-- generated by issue reporter -->`);
        });
        test('serializes remote information when data is provided', () => {
            const issueReporterModel = new issueReporterModel_1.IssueReporterModel({
                issueType: 0,
                systemInfo: {
                    os: 'Darwin',
                    cpus: 'Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)',
                    memory: '16.00GB',
                    vmHint: '0%',
                    processArgs: '',
                    screenReader: 'no',
                    gpuStatus: {
                        '2d_canvas': 'enabled',
                        'checker_imaging': 'disabled_off'
                    },
                    remoteData: [
                        {
                            hostName: 'SSH: Pineapple',
                            machineInfo: {
                                os: 'Linux x64 4.18.0',
                                cpus: 'Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz (2 x 2294)',
                                memory: '8GB',
                                vmHint: '100%'
                            }
                        }
                    ]
                }
            });
            assert.equal(issueReporterModel.serialize(), `
Issue Type: <b>Bug</b>

undefined

VS Code version: undefined
OS version: undefined
Remote OS version: Linux x64 4.18.0

<details>
<summary>System Info</summary>

|Item|Value|
|---|---|
|CPUs|Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)|
|GPU Status|2d_canvas: enabled<br>checker_imaging: disabled_off|
|Load (avg)|undefined|
|Memory (System)|16.00GB|
|Process Argv||
|Screen Reader|no|
|VM|0%|

|Item|Value|
|---|---|
|Remote|SSH: Pineapple|
|OS|Linux x64 4.18.0|
|CPUs|Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz (2 x 2294)|
|Memory (System)|8GB|
|VM|100%|
</details>Extensions: none
<!-- generated by issue reporter -->`);
        });
        test('should normalize GitHub urls', () => {
            [
                'https://github.com/repo',
                'https://github.com/repo/',
                'https://github.com/repo.git',
                'https://github.com/repo/issues',
                'https://github.com/repo/issues/',
                'https://github.com/repo/issues/new',
                'https://github.com/repo/issues/new/'
            ].forEach(url => {
                assert.equal('https://github.com/repo', issueReporterUtil_1.normalizeGitHubUrl(url));
            });
        });
        test('should have support for filing on extensions for bugs, performance issues, and feature requests', () => {
            [
                0 /* Bug */,
                2 /* FeatureRequest */,
                1 /* PerformanceIssue */
            ].forEach(type => {
                const issueReporterModel = new issueReporterModel_1.IssueReporterModel({
                    issueType: type,
                    fileOnExtension: true
                });
                assert.equal(issueReporterModel.fileOnExtension(), true);
            });
            [
                3 /* SettingsSearchIssue */
            ].forEach(type => {
                const issueReporterModel = new issueReporterModel_1.IssueReporterModel({
                    issueType: type,
                    fileOnExtension: true
                });
                assert.equal(issueReporterModel.fileOnExtension(), false);
            });
        });
    });
});
//# sourceMappingURL=testReporterModel.test.js.map