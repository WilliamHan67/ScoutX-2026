package me.tyrus.generator.data

data class Scouter(
    val name: String,
    val pit: Boolean,
    val matches: MutableList<AssignedMatch>,
    val shifts: MutableList<PitShift>
) {
    fun getLatestMatch(): Int? {
        return matches.maxByOrNull { it.match.number }?.match?.number
    }
}