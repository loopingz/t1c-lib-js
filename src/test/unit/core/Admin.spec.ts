/**
 * @author Maarten Somers
 * @since 2018
 */

import { expect } from 'chai';
import { GCLConfig } from '../../../scripts/core/GCLConfig';
import { AdminService } from '../../../scripts/core/admin/admin';
import {LocalAdminConnection, LocalAuthAdminConnection} from '../../../scripts/core/client/Connection';
import {ContainerSyncRequest} from '../../..';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

describe('Admin Services', () => {
    let gclConfig = new GCLConfig({});
    const connection: LocalAuthAdminConnection = new LocalAuthAdminConnection(gclConfig);
    const noAuthConnection: LocalAdminConnection = new LocalAdminConnection(gclConfig);
    let admin = new AdminService('', connection, noAuthConnection);
    let mock;

    beforeEach(() => {

        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    describe('activate', () => {
        beforeEach(function () {
            mock.onPost('https://localhost:10443/admin/activate').reply(() => {
                return [ 200, { data: 'Activation Data', success: true }];
            });
        });

        it('makes the correct call to activate', () => {
            return admin.activate().then(res => {
                expect(res).to.have.property('success');
                expect(res.success).to.be.a('boolean');
                expect(res.success).to.eq(true);

                expect(res).to.have.property('data');
                expect(res.data).to.be.a('string');
                expect(res.data).to.eq('Activation Data');
            });
        });
    });


    describe('getPubKey', () => {
        beforeEach(function () {
            mock.onGet('/admin/certificate').reply(() => {
                return [ 200, { data: { device: 'Device Pub Key', ssl: 'SSL Pub Key' }, success: true }];
            });
        });

        it('makes the correct call to get pub key', () => {
            return admin.getPubKey().then(res => {
                expect(res).to.have.property('success');
                expect(res.success).to.be.a('boolean');
                expect(res.success).to.eq(true);

                expect(res).to.have.property('data');
                expect(res.data).to.be.an('object');

                expect(res.data).to.have.property('device');
                expect(res.data.device).to.be.a('string').eq('Device Pub Key');
                expect(res.data).to.have.property('ssl');
                expect(res.data.device).to.be.a('string').eq('Device Pub Key');
            });
        });
    });

    describe('setPubKey', () => {
        beforeEach(function () {
            mock.onPut('/admin/certificate', { encryptedPublicKey: 'pubkey', encryptedAesKey: 'aeskey' }).reply(() => {
                return [ 200, { data: 'Set Pub Key Data', success: true }];
            });
        });

        it('makes the correct call to set pub key', () => {
            return admin.setPubKey({ encryptedAesKey: 'aeskey', encryptedPublicKey: 'pubkey', ns: '' }).then(res => {
                expect(res).to.have.property('success');
                expect(res.success).to.be.a('boolean');
                expect(res.success).to.eq(true);

                expect(res).to.have.property('data');
                expect(res.data).to.be.a('string');
                expect(res.data).to.eq('Set Pub Key Data');
            });
        });
    });

    describe('updateContainerConfig', () => {
        beforeEach(function () {
            mock.onPost('/admin/containers', 'containerConfig').reply(() => {
                return [ 200, { data: 'Update Container Config', success: true }];
            });
        });

        it('makes the correct call to set pub key', () => {
            return admin.updateContainerConfig(new ContainerSyncRequest(undefined)).then(res => {
                expect(res).to.have.property('success');
                expect(res.success).to.be.a('boolean');
                expect(res.success).to.eq(true);

                expect(res).to.have.property('data');
                expect(res.data).to.be.a('string');
                expect(res.data).to.eq('Update Container Config');
            });
        });
    });
});
