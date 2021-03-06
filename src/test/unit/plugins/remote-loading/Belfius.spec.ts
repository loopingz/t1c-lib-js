
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import {LocalConnection, PluginFactory, GCLConfig} from '../../../..';

let gclconfig = new GCLConfig({});
let activecontainers = new Map<string, string[]>();
activecontainers.set('readerapi', ['readerapi-v2-1-0']);
gclconfig.activeContainers = activecontainers;
const connection: LocalConnection = new LocalConnection(gclconfig);
const belfius = new PluginFactory('', connection).createBelfius('123');
const nonBelfiusReader = new PluginFactory('', connection).createBelfius('321');

let mock: MockAdapter;

beforeEach(() => {
    mock = new MockAdapter(axios);
});

afterEach(() => {
    mock.restore();
});

describe('can open a session', function () {
    beforeEach(function () {
        mock.onPost('containers/readerapi-v2-1-0/123/open-session', {timeout: 5}).reply(() => {
            return [200, {data: '87d2ee2d-6f2e-4de4-a077-a57e8b8d42c3', success: true}];
        });
        mock.onPost('containers/readerapi-v2-1-0/123/open-session', {timeout: 22}).reply(() => {
            return [200, {data: '7f6f5de4-3bb1-4a77-9b30-274196bdf15e', success: true}];
        });
    });

    test('opens a session with default timeout', () => {
        return belfius.openSession().then(res => {
            expect(res).toHaveProperty('success');
            expect(res.success).toEqual(true);

            expect(res).toHaveProperty('data');
            expect(res.data).toEqual('87d2ee2d-6f2e-4de4-a077-a57e8b8d42c3');
        });
    });

    test('opens a session with a specified timeout', () => {
        return belfius.openSession(22).then(res => {
            expect(res).toHaveProperty('success');
            expect(res.success).toEqual(true);

            expect(res).toHaveProperty('data');
            expect(res.data).toEqual('7f6f5de4-3bb1-4a77-9b30-274196bdf15e');
        });
    });
});

describe('can check if a reader is a Belfius reader', function () {
    beforeEach(function () {
        mock.onGet('card-readers/123').reply(() => {
            return [200, {success: true, data: {name: 'A string that includes the phrase VASCO DIGIPASS 870 somewhere'}}];
        });
        mock.onGet('card-readers/321').reply(() => {
            return [200, {success: true, data: {name: 'Some Other Reader'}}];
        });
        mock.onPost('containers/readerapi-v2-1-0/123/apdu', {cla: 'F1', ins: '95', p1: 'F7', p2: 'E4', data: 'FE0000040001300000'})
            .reply(config => {
                if (config.params && config.params['session-id'] && config.params['session-id'] === '123') {
                    return [200, {
                        success: true, data: {
                            rx: 'FE0000040067B4AD49',
                            sw: '9000',
                            tx: 'F195F7E409FE0000040001300000'
                        }
                    }];
                } else {
                    return [200, {success: false, data: 'Incorrect session-id received'}];
                }
            });
        mock.onPost('containers/readerapi-v2-1-0/321/apdu', {cla: 'F1', ins: '95', p1: 'F7', p2: 'E4', data: 'FE0000040001300000'})
            .reply(config => {
                if (config.params && config.params['session-id'] && config.params['session-id'] === '123') {
                    return [200, {
                        success: true, data: {
                            sw: '6297',
                            tx: 'F195F7E409FE0000040001300000'
                        }
                    }];
                } else {
                    return [200, {success: false, data: 'Incorrect session-id received'}];
                }
            });
    });

    test('checks if a sessionId was provided (Belfius Reader)', () => {
        const sessionId: string = undefined as any;
        return belfius.isBelfiusReader(sessionId).then(() => {
            return Promise.reject(new Error('no sessionId was provided, this should fail!'));
        }, error => {
            expect(error).toHaveProperty('code');
            expect(error.code).toEqual('402');

            expect(error).toHaveProperty('status');
            expect(error.status).toEqual(400);

            expect(error).toHaveProperty('description');
            expect(error.description).toEqual('Session ID is required!');
        });
    });

    test('checks if a sessionId was provided (Non-Belfius Reader)', () => {
        const sessionId: string = undefined as any;
        return nonBelfiusReader.isBelfiusReader(sessionId).then(() => {
            return Promise.reject(new Error('no sessionId was provided, this should fail!'));
        }, error => {
            expect(error).toHaveProperty('code');
            expect(error.code).toEqual('402');

            expect(error).toHaveProperty('status');
            expect(error.status).toEqual(400);

            expect(error).toHaveProperty('description');
            expect(error.description).toEqual('Session ID is required!');
        });
    });

    test('correctly identifies a Belfius reader', () => {
        return belfius.isBelfiusReader('123').then(res => {
            expect(res).toHaveProperty('success');
            expect(res.success).toEqual(true);

            expect(res).toHaveProperty('data');
        });
    });

    test('correctly identifies a non-Belfius reader', () => {
        return nonBelfiusReader.isBelfiusReader('123').then(res => {
            expect(res).toHaveProperty('success');
            expect(res.success).toEqual(true);

            expect(res).toHaveProperty('data');
        });
    });
});

describe('can retrieve a nonce', function () {
    beforeEach(function () {
        mock.onGet('card-readers/123').reply(() => {
            return [200, {success: true, data: {name: 'VASCO DIGIPASS 870'}}];
        });
        mock.onPost('containers/readerapi-v2-1-0/123/apdu', {cla: 'F1', ins: '95', p1: 'F7', p2: 'E4', data: 'FE0000040001300000'})
            .reply(config => {
                if (config.params && config.params['session-id'] && config.params['session-id'] === '123') {
                    return [200, {
                        success: true, data: {
                            rx: 'FE0000040067B4AD49',
                            sw: '9000',
                            tx: 'F195F7E409FE0000040001300000'
                        }
                    }];
                } else {
                    return [200, {success: false, data: 'Incorrect session-id received'}];
                }
            });
    });

    test('checks if a sessionId was provided', () => {
        const sessionId: string = undefined as any;
        return belfius.nonce(sessionId).then(() => {
            return Promise.reject(new Error('no sessionId was provided, this should fail!'));
        }, error => {
            expect(error).toHaveProperty('code');
            expect(error.code).toEqual('402');

            expect(error).toHaveProperty('status');
            expect(error.status).toEqual(400);

            expect(error).toHaveProperty('description');
            expect(error.description).toEqual('Session ID is required!');
        });
    });

    test('retrieves a nonce for a session', () => {
        return belfius.nonce('123').then(res => {
            expect(res).toHaveProperty('success');
            expect(res.success).toEqual(true);

            expect(res).toHaveProperty('data');

            expect(res.data).toHaveProperty('tx');
            expect(res.data.tx).toEqual('F195F7E409FE0000040001300000');

            expect(res.data).toHaveProperty('sw');
            expect(res.data.sw).toEqual('9000');

            expect(res.data).toHaveProperty('rx');
            expect(res.data.rx).toEqual('FE0000040067B4AD49');
        });
    });
});

describe('can send an STX command', function () {
    beforeEach(function () {
        mock.onGet('card-readers/123').reply(() => {
            return [200, {success: true, data: {name: 'VASCO DIGIPASS 870'}}];
        });
        mock.onPost('containers/readerapi-v2-1-0/123/apdu', {cla: 'F1', ins: '95', p1: 'F7', p2: 'E4', data: 'FE0000040001300000'})
            .reply(config => {
                if (config.params && config.params['session-id'] && config.params['session-id'] === '123') {
                    return [200, {
                        success: true, data: {
                            rx: 'FE0000040067B4AD49',
                            sw: '9000',
                            tx: 'F195F7E409FE0000040001300000'
                        }
                    }];
                } else {
                    return [200, {success: false, data: 'Incorrect session-id received'}];
                }
            });
        mock.onPost('containers/readerapi-v2-1-0/123/apdu')
            .reply(config => {
                if (config.params && config.params['session-id'] && config.params['session-id'] === '123') {
                    return [200, {
                        success: true, data: {
                            rx: JSON.parse(config.data).data,
                            sw: '9000',
                            tx: 'F195F7E409FE0000040001300000'
                        }
                    }];
                } else {
                    return [200, {success: false, data: 'Incorrect session-id received'}];
                }
            });
        mock.onPost('containers/readerapi-v2-1-0/123/apdus')
            .reply(config => {
                if (config.params && config.params['session-id'] && config.params['session-id'] === '123') {
                    const data = JSON.parse(config.data);
                    return [200, {
                        success: true, data: [{
                            rx: data[0].data,
                            sw: '9000',
                            tx: 'F195F7E409FE0000040001300000'
                        }, {
                            rx: data[1].data,
                            sw: '9000',
                            tx: 'F195F7E409FE0000040001300000'
                        }, {
                            rx: data[2].data,
                            sw: '9000',
                            tx: 'F195F7E409FE0000040001300000'
                        }]
                    }];
                } else {
                    return [200, {success: false, data: 'Incorrect session-id received'}];
                }
            });
    });

    test('checks if a sessionId was provided', () => {
        const sessionId: string = undefined as any;
        return belfius.stx('FE0000040001300000', sessionId).then(() => {
            return Promise.reject(new Error('no sessionId was provided, this should fail!'));
        }, error => {
            expect(error).toHaveProperty('code');
            expect(error.code).toEqual('402');

            expect(error).toHaveProperty('status');
            expect(error.status).toEqual(400);

            expect(error).toHaveProperty('description');
            expect(error.description).toEqual('Session ID is required!');
        });
    });

    test('executes an STX command for a session', () => {
        return belfius.stx('FE0000040001300000', '123').then(res => {
            expect(res).toHaveProperty('success');
            expect(res.success).toEqual(true);

            expect(res).toHaveProperty('data');

            expect(res.data).toHaveProperty('tx');
            expect(res.data.tx).toEqual('F195F7E409FE0000040001300000');

            expect(res.data).toHaveProperty('sw');
            expect(res.data.sw).toEqual('9000');

            expect(res.data).toHaveProperty('rx');
            expect(res.data.rx).toEqual('00FE0000040001300000');
        });
    });

    test('correctly sets length byte for a request < 250 bytes', () => {
        return belfius.stx('1234567890ABCDEF', '123').then(res => {
            expect(res).toHaveProperty('success');
            expect(res.success).toEqual(true);

            expect(res).toHaveProperty('data');

            expect(res.data).toHaveProperty('rx');
            expect(res.data.rx).toEqual('001234567890ABCDEF');
        });
    });

    test('correctly sets length byte for a request == 250 bytes', () => {
        let command = '336924d5efdb326ee6e7d3eeb43b4f22' +
            'da0e256e515695a539e5f1eb32d377ec' +
            '5c454ca07b020ba60d8938aab27dc4ee' +
            '1e26996580dc86b3cfd4bd5c87d1d74a' +
            '9355e3c92bc5b5cf89cb4b3f5b35b65f' +
            'aa09ba2824bb7fe7352260721aa209f4' +
            '81111670c194d4e3e322aab4dc30ff69' +
            '7885b79f308d358ae5cf539dddfda325' +
            '25dda3c0e22192b7bdf4a66ebe4d952f' +
            '423fc6c971741e05b1a3e9eb719663e5' +
            'fc07996049d7abffcf46ef1f2e09359e' +
            '67dd4c030f34d9037f0f867bfcd99824' +
            'a22dac304b482358d081dcf517f2502d' +
            'eccc49b83632f386e0055300981ce956' +
            '17129a4e975eecee62d2fb21f1ee3374' +
            '686936a4a906e8fc0735';
        return belfius.stx(command, '123').then(res => {
            expect(res).toHaveProperty('success');
            expect(res.success).toEqual(true);

            expect(res).toHaveProperty('data');

            expect(res.data).toHaveProperty('rx');
            expect(res.data.rx).toEqual('00' + command);
        });
    });

    test('correctly sets length bytes for a request > 250 bytes', () => {
        let command1 = '116924d5efdb326ee6e7d3eeb43b4f22' +
            'da0e256e515695a539e5f1eb32d377ec' +
            '5c454ca07b020ba60d8938aab27dc4ee' +
            '1e26996580dc86b3cfd4bd5c87d1d74a' +
            '9355e3c92bc5b5cf89cb4b3f5b35b65f' +
            'aa09ba2824bb7fe7352260721aa209f4' +
            '81111670c194d4e3e322aab4dc30ff69' +
            '7885b79f308d358ae5cf539dddfda325' +
            '25dda3c0e22192b7bdf4a66ebe4d952f' +
            '423fc6c971741e05b1a3e9eb719663e5' +
            'fc07996049d7abffcf46ef1f2e09359e' +
            '67dd4c030f34d9037f0f867bfcd99824' +
            'a22dac304b482358d081dcf517f2502d' +
            'eccc49b83632f386e0055300981ce956' +
            '17129a4e975eecee62d2fb21f1ee3374' +
            '686936a4a906e8fc0735';
        let command2 = '226924d5efdb326ee6e7d3eeb43b4f22' +
            'da0e256e515695a539e5f1eb32d377ec' +
            '5c454ca07b020ba60d8938aab27dc4ee' +
            '1e26996580dc86b3cfd4bd5c87d1d74a' +
            '9355e3c92bc5b5cf89cb4b3f5b35b65f' +
            'aa09ba2824bb7fe7352260721aa209f4' +
            '81111670c194d4e3e322aab4dc30ff69' +
            '7885b79f308d358ae5cf539dddfda325' +
            '25dda3c0e22192b7bdf4a66ebe4d952f' +
            '423fc6c971741e05b1a3e9eb719663e5' +
            'fc07996049d7abffcf46ef1f2e09359e' +
            '67dd4c030f34d9037f0f867bfcd99824' +
            'a22dac304b482358d081dcf517f2502d' +
            'eccc49b83632f386e0055300981ce956' +
            '17129a4e975eecee62d2fb21f1ee3374' +
            '686936a4a906e8fc0735';
        let command3 = '336924d5efdb326ee6e7d3eeb43b4f22' +
            'da0e256e515695a539e5f1eb32d377ec' +
            '5c454ca07b020ba60d8938aab27dc4ee' +
            '1e26996580dc86b3cfd4bd5c87d1d74a' +
            '9355e3c92bc5b5cf89cb4b3f5b35b65f' +
            'aa09ba2824bb7fe7352260721aa209f4' +
            '81111670c194d4e3e322aab4dc30ff69' +
            '7885b79f308d358ae5cf539dddfda325' +
            '25dda3c0e22192b7bdf4a66ebe4d952f' +
            '423fc6c971741e05b1a3e9eb719663e5' +
            'fc07996049d7abffcf46ef1f2e09359e' +
            '67dd4c030f34d9037f0f867bfcd99824' +
            'a22dac304b482358d081dcf517f2502d' +
            'eccc49b83632f386e0055300981ce956' +
            '17129a4e975eecee62d2fb21f1ee3374' +
            '686936a4a906e8fc0735';
        return belfius.stx(command1 + command2 + command3, '123').then(res => {
            expect(res).toHaveProperty('success');
            expect(res.success).toEqual(true);

            expect(res).toHaveProperty('data');

            expect(res.data).toHaveProperty('rx');
            expect(res.data.rx).toEqual('01' + command1 + '03' + command2 + '02' + command3);
        });
    });
});

describe('can close a session', function () {
    beforeEach(function () {
        mock.onGet('containers/readerapi-v2-1-0/123/close-session').reply(() => {
            return [200, {success: true}];
        });
    });

    test('closes the session', () => {
        return belfius.closeSession('123').then(res => {
            expect(res).toHaveProperty('success');
            expect(res.success).toEqual(true);
        });
    });
});
