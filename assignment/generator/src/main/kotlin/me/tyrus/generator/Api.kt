package me.tyrus.generator

import kotlinx.serialization.json.*
import me.tyrus.generator.data.Match
import java.net.HttpURLConnection
import java.net.URL

private const val API_KEY = "34BlIMxWP39o50BJdkqcVoRgwLsb8kkI8UqetKLKn3BwHfCfAk4La9EGpzaCQwTe"
private const val ENDPOINT = "https://www.thebluealliance.com/api/v3"
private const val EVENT_KEY = "2023utwv"

private val JSON = Json {
    ignoreUnknownKeys = true
}

class Api {
    fun getMatches(): List<Match> {
        val matches = mutableListOf<Match>()
        val url = URL("$ENDPOINT/event/$EVENT_KEY/matches/simple")
        with(url.openConnection() as HttpURLConnection) {
            requestMethod = "GET"
            setRequestProperty("X-TBA-Auth-Key", API_KEY)
            val json = JSON.decodeFromString<Array<JsonObject>>(inputStream.bufferedReader().readText())
            json.forEach { match ->
                val number = match["match_number"]?.jsonPrimitive?.int
                val alliances = match["alliances"]!!.jsonObject
                val red = alliances["red"]!!.jsonObject["team_keys"]!!.jsonArray.map { it.jsonPrimitive.content }
                val blue = alliances["blue"]!!.jsonObject["team_keys"]!!.jsonArray.map { it.jsonPrimitive.content }
                matches.add(Match(number!!, red.toTypedArray(), blue.toTypedArray()))
            }
        }
        return matches
    }
}