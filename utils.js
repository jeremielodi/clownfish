function detectSeparator(subject) {
  if (subject.includes('--')) {
    return '--';
  }

  if (subject.includes('-')) {
    return '-';
  }


  if (subject.includes('–')) {
    return '–';
  }

  return '';
}

const reply = new RegExp('re:', 'g');
const fwd = new RegExp('fwd:', 'g');
function stripForwardAndReply(subject) {
  return subject.toLowerCase()
    .replace(reply, '')
    .replace(fwd, '')
    .trim();
}

/**
 * @function parseSubjectLine
 *
 * @description
 * Parses the subject line of the email to bring out the
 */
function parseSubjectLine(subject) {
  // support multiple kinds of separators.
  const separator = detectSeparator(subject);
  const parsed = stripForwardAndReply(subject);

  const [structure, reportName] = parsed.split(separator);

  // normalize reporting structure names
  const normalizedStructure = structure.toLowerCase().trim();
  const normalizedReportName = reportName.toLowerCase().trim();

  return { normalizedStructure, normalizedReportName };
}

exports.parseSubjectLine = parseSubjectLine;
