/**
 * @file index.ts
 * @description Main entrypoint for Active Directory & LDAP Single Sign-On extension module.
 * @module @cmox/plugin-active-directory-ldap
 */

export * from './types';
export * from './config';
export * from './guardrails';
export * from './telemetry';
export * from './client';
export * from './pipeline';
export * from './adapter';
export * from './bridge';
export * from './engine';

import { ActiveDirectoryLDAPSingleSignOnEngine } from './engine';
export default ActiveDirectoryLDAPSingleSignOnEngine;
