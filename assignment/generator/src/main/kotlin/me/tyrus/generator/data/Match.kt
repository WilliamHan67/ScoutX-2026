package me.tyrus.generator.data

data class Match(
    val number: Int = 0,
    val alliances: Map<AllianceColor, List<Int>> = emptyMap()
) {
    constructor(
        number: Int,
        red: Array<String>,
        blue: Array<String>
    ) : this(number, mapOf(
        AllianceColor.RED to red.map { it.replace("frc", "").toInt() },
        AllianceColor.BLUE to blue.map { it.replace("frc", "").toInt() }
    ))
}