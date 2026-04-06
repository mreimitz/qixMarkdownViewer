// This file gets bundled to produce just the markdown libs as an IIFE
import { marked } from 'marked';
import DOMPurify from 'dompurify';

globalThis.__mdLibs = { marked, DOMPurify };
