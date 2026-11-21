package org.pecvih.arvp.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = NavyBluePrimary,
    secondary = EmeraldGreenSecondary,
    background = LightBackground,
    surface = SurfaceWhite
)

@Composable
fun ARVPédiatriqueTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography,
        content = content
    )
}
