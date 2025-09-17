class ResumeMatcher:
    def __init__(self, job_description: str):
        self.job_description = job_description

    def match(self, resume_text: str) -> float:
        # Implement the matching algorithm here
        # For now, return a dummy score
        return self._calculate_similarity(resume_text)

    def _calculate_similarity(self, resume_text: str) -> float:
        # Placeholder for similarity calculation logic
        return 0.75  # Dummy similarity score for demonstration purposes

def extract_keywords(job_description: str) -> list:
    # Extract keywords from the job description
    return job_description.lower().split()  # Simple split for demonstration purposes