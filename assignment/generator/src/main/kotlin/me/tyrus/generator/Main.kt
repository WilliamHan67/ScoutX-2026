package me.tyrus.generator

import me.tyrus.generator.data.Scouter

object Main {
    @JvmStatic
    fun main(args: Array<String>) {
        val scoutersFile = javaClass.getResource("/scouters.txt").readText()

        val scouterNames = scoutersFile.split("\n")
        val scouters: MutableList<Scouter> = mutableListOf()
        scouterNames.forEach {
            val split = it.split(";")
            if (split.size > 2) {
                throw IllegalArgumentException("Invalid scouter format: $it")
            }
            val name = split[0]
            val pit = split.getOrNull(1)?.toBoolean() ?: false
            scouters.add(Scouter(name, pit, mutableListOf(), mutableListOf()))
            println("Added scouter: $name")
        }

        val api = Api()
        val matches = api.getMatches()

        val scoutingGroups: MutableList<MutableList<Scouter>> = mutableListOf()
        var group = mutableListOf<Scouter>()
        val checkedScouters = mutableListOf<Scouter>()
        scouters.forEach { scouter ->
            checkedScouters.add(scouter)
            group.add(scouter)
            if (group.size == 6) {
                scoutingGroups.add(group)
                group = mutableListOf()
                return@forEach
            }
        }
        scoutingGroups.add((checkedScouters - scoutingGroups.flatten().toSet()).toMutableList())

        scoutingGroups.forEachIndexed { index, scouters ->
            println("Group ${index + 1}: ${scouters.joinToString { it.name }}")
        }

        matches.forEach { match ->

        }

    }
}