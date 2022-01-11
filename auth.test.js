import { testSaga } from 'redux-saga-test-plan';
import { get } from 'lodash';
import { REHYDRATE } from 'redux-persist';

import { removeTokens, saveTokens, getSavedTokens } from 'utilities/helpers';
import { expApi } from 'core/network/api';
import { clearFulfilledOrders } from 'core/actions/order';
import { appetentiveCustomerPersonData } from 'core/apptentive';

import { select as _select } from '../../selectors';
import { logLoginFailure, logLoginSuccess, logLogoutSuccess } from '../../analytics';
import { getAuth, getLogoutAuth, refreshUserToken } from '../../actions/auth';
import {
  authSaga,
  authLogoutSaga,
  watchAuthSaga,
  watchRefreshTokenSaga,
  refreshToken,
  auth0,
  authLogic,
  refreshAfterRehydreated,
  statusChannel,
  deviceUniqId
} from '../auth';
import { getCustomerInfo } from '../../network/endpoints';
import { shouldRefreshToken } from '../../helpers';


const { webAuth, auth } = auth0;

const token = 'fakeAccessToken';
const refreshTokenData = 'fakeRefreshToken';
const idToken = 'fakeIdToken';
const fakeAuthToken = {
  accessToken: token,
  idToken,
  refreshToken: refreshTokenData,
};

const userDetails = {
  firstName: 'first name',
  lastName: 'last name',
  email: 'email',
  birthDate: 'birth date',
  phones: 'phones',
  preferences: 'preferences',
  customerId: 'customerId',
};

describe('authSaga', () => {
  it('handles success request', () => {
    testSaga(authSaga)
      .next()
      .call([webAuth, webAuth.authorize], { scope: 'openid offline_access email profile', connection: 'firebase-auth' }, { ephemeralSession: true })
      .next({ idToken, refreshToken: refreshTokenData })
      .call([expApi, expApi.setAccessToken], idToken)
      .next()
      .call(saveTokens, refreshTokenData, idToken)
      .next()
      .call(getCustomerInfo, {})
      .next(userDetails)
      .put(getAuth.success({ userData: userDetails }))
      .next()
      .call(logLoginSuccess, userDetails.customerId)
      .next()
      .call(appetentiveCustomerPersonData, userDetails.customerId)
      .next()
      .isDone();
  });

  it('handles error', () => {
    const error = new Error('error');

    testSaga(authSaga)
      .next()
      .throw(error)
      .put(getAuth.failure())
      .next()
      .call(logLoginFailure)
      .next()
      .isDone();
  });

});


describe('authLogoutSaga', () => {
  it('handles success request', () => {
    testSaga(authLogoutSaga)
      .next()
      .call(removeTokens)
      .next()
      .call([expApi, expApi.removeAccessToken])
      .next()
      .select(_select.user.userDetails)
      .next(userDetails)
      .call(get, userDetails, 'customerId', '')
      .next(userDetails.customerId)
      .call(logLogoutSuccess, userDetails.customerId)
      .next()
      .call(appetentiveCustomerPersonData, deviceUniqId)
      .next()
      .put(clearFulfilledOrders())
      .next()
      .put(getLogoutAuth.success())
      .next()
      .isDone();
  });

  it('handles error', () => {
    const error = new Error('error');
    testSaga(authLogoutSaga)
      .next()
      .throw(error)
      .put(getLogoutAuth.failure())
      .next()
      .isDone();
  });
});

describe('refreshTokenSaga', () => {
  it('handles request with cancel', () => {
    testSaga(refreshToken)
      .next()
      .call(getSavedTokens)
      .next(fakeAuthToken)
      .call(get, fakeAuthToken, 'idToken')
      .next(idToken)
      .call(get, fakeAuthToken, 'refreshToken')
      .next(refreshTokenData)
      .call(shouldRefreshToken, idToken)
      .next(false)
      .call([expApi, expApi.setAccessToken], idToken)
      .next()
      .select(_select.user.userDetails)
      .next(userDetails)
      .call(appetentiveCustomerPersonData, userDetails.customerId)
      .next()
      .put(refreshUserToken.cancel())
      .next()
      .isDone();
  });

  it('handles request without refresh token', () => {
    testSaga(refreshToken)
      .next()
      .call(getSavedTokens)
      .next(fakeAuthToken)
      .call(get, fakeAuthToken, 'idToken')
      .next(idToken)
      .call(get, fakeAuthToken, 'refreshToken')
      .next(undefined)
      .call(shouldRefreshToken, idToken)
      .next(true)
      .put(refreshUserToken.failure('user was not authorized'))
      .next()
      .isDone();
  });

  it('handles success request', () => {
    testSaga(refreshToken)
      .next()
      .call(getSavedTokens)
      .next(fakeAuthToken)
      .call(get, fakeAuthToken, 'idToken')
      .next(idToken)
      .call(get, fakeAuthToken, 'refreshToken')
      .next(refreshTokenData)
      .call(shouldRefreshToken, idToken)
      .next(true)
      .call([auth, auth.refreshToken], { refreshToken: refreshTokenData, scope: 'openid offline_access profile email' })
      .next({ refreshToken: refreshTokenData, idToken })
      .call([expApi, expApi.setAccessToken], idToken)
      .next()
      .call(saveTokens, refreshTokenData, idToken)
      .next()
      .call(getCustomerInfo, {})
      .next(userDetails)
      .put(refreshUserToken.success({ userData: userDetails }))
      .next()
      .call(appetentiveCustomerPersonData, userDetails.customerId)
      .next()
      .isDone();
  });


  it('handles error', () => {
    const error = new Error('error');
    testSaga(refreshToken)
      .next()
      .throw(error)
      .put(refreshUserToken.failure('one of the calls failed'))
      .next()
      .select(_select.user.isLoggedIn)
      .next(true)
      .call(removeTokens)
      .next()
      .call(appetentiveCustomerPersonData, deviceUniqId)
      .next()
      .put(getLogoutAuth.success())
      .next()
      .call(authSaga)
      .next()
      .isDone();
  });
});

describe('authLogicSaga', () => {
  it('handles success request', () => {
    testSaga(authLogic, 'active')
      .next()
      .put(refreshUserToken.request())
      .next()
      .call(refreshToken)
      .next()
      .isDone();
  });
});

describe('refreshAfterRehydreatedSaga', () => {
  it('handles success request', () => {
    testSaga(refreshAfterRehydreated)
      .next()
      .select(_select.persist.rehydrated)
      .next(false)
      .take(REHYDRATE)
      .next()
      .call(getSavedTokens)
      .next(fakeAuthToken)
      .put(refreshUserToken.request())
      .next()
      .call(refreshToken)
      .next()
      .isDone();
  });

  it('handles logout request', () => {
    testSaga(refreshAfterRehydreated)
      .next()
      .select(_select.persist.rehydrated)
      .next(true)
      .call(getSavedTokens)
      .next()
      .select(_select.user.isLoggedIn)
      .next(true)
      .put(getLogoutAuth.request())
      .next()
      .isDone();
  });

  it('handles appetentive request', () => {
    testSaga(refreshAfterRehydreated)
      .next()
      .select(_select.persist.rehydrated)
      .next(true)
      .call(getSavedTokens)
      .next()
      .select(_select.user.isLoggedIn)
      .next(false)
      .call(appetentiveCustomerPersonData, deviceUniqId)
      .next()
      .isDone();
  });
});

describe('watchAuthSaga', () => {

  it('handles watch', () => {

    testSaga(watchAuthSaga)
      .next()
      .takeEvery(getAuth.request, authSaga)
      .next()
      .takeEvery(getLogoutAuth.request, authLogoutSaga);
  });
});

describe('watchRefreshTokenSaga', () => {

  it('handles watch', () => {

    testSaga(watchRefreshTokenSaga)
      .next()
      .call(refreshAfterRehydreated)
      .next()
      .takeEvery(statusChannel, authLogic);
  });
});
