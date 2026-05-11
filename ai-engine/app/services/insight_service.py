def generate_insights(issues):

    insight_map = {}

    for issue in issues:

        issue_type = issue["type"]

        insight_map[issue_type] = (
            insight_map.get(issue_type, 0) + 1
        )

    insights = []

    for key, value in insight_map.items():

        insights.append(
            f"{value} issue(s) detected for {key}"
        )

    return insights