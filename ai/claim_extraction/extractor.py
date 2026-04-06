import re

ESG_KEYWORDS = [
    "emission",
    "carbon",
    "water",
    "energy",
    "sustainability",
    "forest",
    "climate",
]

ACTION_WORDS = [
    "reduced",
    "increased",
    "achieved",
    "improved",
    "committed",
    "target",
]

STRONG_ACTION_WORDS = ["reduced", "achieved", "increased", "improved"]

VAGUE_WORDS = [
    "committed",
    "responsibility",
    "transparency",
    "follows",
    "guidelines",
    "process",
]

IGNORE_KEYWORDS = ["invoice", "invoices", "personal data", "payment info"]

SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+")
BULLET_PREFIX_RE = re.compile(r"(?m)^\s*(?:[-*•●◦▪‣►]|(?:\d+|[a-zA-Z])[.)])\s+")
NUMBER_RE = re.compile(r"\d")
MULTISPACE_RE = re.compile(r"\s+")
MEASURABLE_WORD_RE = re.compile(r"\b(facility|facilities|plant|plants|site|sites)\b")
MIN_SENTENCE_WORDS = 6


def _normalize_text(text: str) -> str:
    # Remove leading bullet markers before line-break normalization.
    normalized = BULLET_PREFIX_RE.sub("", text)
    normalized = re.sub(r"\n+", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized.strip()


def _split_sentences(text: str) -> list[str]:
    if not text.strip():
        return []

    normalized = _normalize_text(text)
    if not normalized:
        return []

    return [part.strip() for part in SENTENCE_SPLIT_RE.split(normalized) if part.strip()]


def _clean_sentence(sentence: str) -> str:
    return MULTISPACE_RE.sub(" ", sentence).strip()


def _has_min_word_count(sentence: str) -> bool:
    words = [w for w in sentence.split() if w]
    return len(words) >= MIN_SENTENCE_WORDS


def _contains_esg_keyword(sentence: str) -> bool:
    lower_sentence = sentence.lower()
    return any(keyword in lower_sentence for keyword in ESG_KEYWORDS)


def _contains_action_or_number(sentence: str) -> bool:
    lower_sentence = sentence.lower()
    has_number = bool(NUMBER_RE.search(lower_sentence))
    has_action = any(keyword in lower_sentence for keyword in ACTION_WORDS)
    return has_number or has_action


def _contains_strong_action_or_number(sentence: str) -> bool:
    lower_sentence = sentence.lower()
    has_number = bool(NUMBER_RE.search(lower_sentence))
    has_strong_action = any(keyword in lower_sentence for keyword in STRONG_ACTION_WORDS)
    return has_number or has_strong_action


def _has_measurable_metric(sentence: str) -> bool:
    lower_sentence = sentence.lower()
    return bool(NUMBER_RE.search(lower_sentence) or MEASURABLE_WORD_RE.search(lower_sentence))


def _is_vague_esg_sentence(sentence: str) -> bool:
    lower_sentence = sentence.lower()
    has_vague_word = any(keyword in lower_sentence for keyword in VAGUE_WORDS)
    return has_vague_word and not _has_measurable_metric(sentence)


def _is_ignored(sentence: str) -> bool:
    lower_sentence = sentence.lower()
    return any(keyword in lower_sentence for keyword in IGNORE_KEYWORDS)


def _classify_claim(_sentence: str) -> str:
    return "environmental"


def extract_claims(text: str) -> list:
    # Keep only ESG-related claims with measurable progress/action language.
    claims: list[dict[str, str]] = []

    for sentence in _split_sentences(text):
        if _is_ignored(sentence):
            continue
        if not _has_min_word_count(sentence):
            continue
        if not _contains_esg_keyword(sentence):
            continue
        if _is_vague_esg_sentence(sentence):
            continue
        if not _contains_action_or_number(sentence):
            continue

        claim_type = _classify_claim(sentence)

        cleaned_sentence = _clean_sentence(sentence)
        claim_key = cleaned_sentence.lower()

        existing_claim_texts = [item["claim"].lower() for item in claims]
        if claim_key in existing_claim_texts:
            continue

        should_skip = False
        indexes_to_remove: list[int] = []
        for idx, existing in enumerate(existing_claim_texts):
            if claim_key in existing:
                should_skip = True
                break
            if existing in claim_key:
                indexes_to_remove.append(idx)

        if should_skip:
            continue

        for idx in reversed(indexes_to_remove):
            del claims[idx]

        claims.append(
            {
                "claim": cleaned_sentence,
                "type": claim_type,
            }
        )

    return claims
