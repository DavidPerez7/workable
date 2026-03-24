package com.workable.mobile.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.BorderStroke
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.workable.mobile.ui.theme.WorkablePrimary

private val WorkableCardShape = RoundedCornerShape(28.dp)
private val WorkablePillShape = RoundedCornerShape(999.dp)

@Composable
fun WorkablePageBackground(content: @Composable BoxScope.() -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .drawBehind {
                // First radial gradient
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(Color.Black.copy(alpha = 0.2f), Color.Black.copy(alpha = 0.1f)),
                        center = androidx.compose.ui.geometry.Offset(size.width * 0.2f, size.height * 0.3f),
                        radius = size.maxDimension
                    ),
                    center = androidx.compose.ui.geometry.Offset(size.width * 0.2f, size.height * 0.3f),
                    radius = size.maxDimension
                )
                // Second radial gradient
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(Color(0xFF3B82F6).copy(alpha = 0.3f), Color(0xFFF59E0B).copy(alpha = 0.2f)),
                        center = androidx.compose.ui.geometry.Offset(size.width * 0.8f, size.height * 0.7f),
                        radius = size.maxDimension
                    ),
                    center = androidx.compose.ui.geometry.Offset(size.width * 0.8f, size.height * 0.7f),
                    radius = size.maxDimension
                )
            }
    ) {
        Box(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(top = 32.dp, end = 16.dp)
                .size(140.dp)
                .clip(WorkablePillShape)
                .background(Color(0xFF93C5FD).copy(alpha = 0.20f))
        )
        Box(
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(top = 110.dp, start = 18.dp)
                .size(72.dp)
                .clip(WorkablePillShape)
                .background(Color(0xFFFDE68A).copy(alpha = 0.30f))
        )
        Box(
            modifier = Modifier
                .align(Alignment.CenterEnd)
                .padding(end = 10.dp)
                .size(88.dp)
                .clip(WorkablePillShape)
                .background(Color(0xFFBFDBFE).copy(alpha = 0.18f))
        )
        Box(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(bottom = 96.dp, start = 10.dp)
                .size(96.dp)
                .clip(WorkablePillShape)
                .background(Color(0xFFFDE68A).copy(alpha = 0.34f))
        )
        Box(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(bottom = 42.dp, end = 28.dp)
                .size(58.dp)
                .clip(WorkablePillShape)
                .background(Color(0xFF93C5FD).copy(alpha = 0.16f))
        )
        content()
    }
}

@Composable
fun WorkableScrollableColumn(
    modifier: Modifier = Modifier,
    contentPadding: Dp = 20.dp,
    verticalSpacing: Dp = 16.dp,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(contentPadding),
        verticalArrangement = Arrangement.spacedBy(verticalSpacing),
        content = content,
    )
}

@Composable
fun WorkableSurfaceCard(
    modifier: Modifier = Modifier,
    contentPadding: Dp = 20.dp,
    content: @Composable ColumnScope.() -> Unit,
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.9f), WorkableCardShape),
        shape = WorkableCardShape,
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 14.dp),
    ) {
        Column(
            modifier = Modifier.padding(contentPadding),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            content = content,
        )
    }
}

@Composable
fun WorkableSectionHeader(title: String, subtitle: String) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
            text = "WORKABLE",
            style = MaterialTheme.typography.labelLarge,
            color = WorkablePrimary,
        )
        Text(
            text = title,
            style = MaterialTheme.typography.headlineMedium,
            color = Color.Black,
        )
        Text(
            text = subtitle,
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Black,
        )
    }
}

@Composable
fun WorkableSectionDivider() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp)
            .height(1.dp)
            .background(MaterialTheme.colorScheme.outline.copy(alpha = 0.28f))
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkableTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    placeholder: String? = null,
    singleLine: Boolean = true,
    maxLines: Int = if (singleLine) 1 else 4,
    readOnly: Boolean = false,
    enabled: Boolean = true,
    visualTransformation: VisualTransformation = VisualTransformation.None,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, color = Color.Black) },
        placeholder = placeholder?.let { { Text(it, color = Color.Black) } },
        modifier = modifier.fillMaxWidth(),
        singleLine = singleLine,
        maxLines = maxLines,
        readOnly = readOnly,
        enabled = enabled,
        shape = RoundedCornerShape(14.dp),
        visualTransformation = visualTransformation,
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = WorkablePrimary,
            unfocusedBorderColor = WorkablePrimary.copy(alpha = 0.75f),
            focusedLabelColor = WorkablePrimary,
            unfocusedLabelColor = Color.Black,
            cursorColor = WorkablePrimary,
            focusedContainerColor = Color.White,
            unfocusedContainerColor = Color.White,
            focusedTextColor = Color.Black,
            unfocusedTextColor = Color.Black,
            focusedPlaceholderColor = Color.Black,
            unfocusedPlaceholderColor = Color.Black,
        ),
    )
}

@Composable
fun WorkablePill(
    text: String,
    modifier: Modifier = Modifier,
    containerColor: Color = MaterialTheme.colorScheme.secondaryContainer,
    contentColor: Color = MaterialTheme.colorScheme.onSecondaryContainer,
) {
    Card(
        modifier = modifier,
        shape = WorkablePillShape,
        colors = CardDefaults.cardColors(containerColor = containerColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 9.dp),
            color = contentColor,
            style = MaterialTheme.typography.labelLarge,
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkableSelectablePill(
    text: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Card(
        onClick = onClick,
        modifier = modifier,
        shape = WorkablePillShape,
        colors = CardDefaults.cardColors(
            containerColor = if (selected) WorkablePrimary else Color.White,
        ),
        border = BorderStroke(1.dp, WorkablePrimary),
        elevation = CardDefaults.cardElevation(defaultElevation = if (selected) 1.dp else 0.dp),
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 9.dp),
            color = if (selected) Color.White else Color.Black,
            style = MaterialTheme.typography.labelLarge,
        )
    }
}

@Composable
fun WorkablePrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    Button(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        enabled = enabled,
        shape = RoundedCornerShape(14.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = WorkablePrimary,
            contentColor = Color.White,
        ),
    ) {
        Text(text)
    }
}

@Composable
fun WorkableSecondaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    OutlinedButton(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        enabled = enabled,
        shape = RoundedCornerShape(14.dp),
        colors = ButtonDefaults.outlinedButtonColors(
            contentColor = WorkablePrimary,
        ),
        border = BorderStroke(1.dp, WorkablePrimary),
    ) {
        Text(text)
    }
}

@Composable
fun WorkableModuleCard(
    title: String,
    description: String,
    primaryActionText: String,
    secondaryActionText: String,
    onPrimaryClick: () -> Unit,
    onSecondaryClick: () -> Unit,
) {
    WorkableSurfaceCard {
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            color = Color.Black,
        )
        Text(
            text = description,
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Black,
        )
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            WorkablePrimaryButton(
                text = primaryActionText,
                onClick = onPrimaryClick,
                modifier = Modifier.weight(1f),
            )
            WorkableSecondaryButton(
                text = secondaryActionText,
                onClick = onSecondaryClick,
                modifier = Modifier.weight(1f),
            )
        }
    }
}

@Composable
fun WorkableMetricCard(
    value: String,
    label: String,
    modifier: Modifier = Modifier,
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Text(
                text = value,
                style = MaterialTheme.typography.headlineSmall,
                color = MaterialTheme.colorScheme.onPrimary,
            )
            Text(
                text = label,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.92f),
            )
        }
    }
}

@Composable
fun WorkableHeroCard(
    title: String,
    subtitle: String,
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit = {},
) {
    WorkableSurfaceCard(modifier = modifier, contentPadding = 22.dp) {
        Text(
            text = "WORKABLE",
            style = MaterialTheme.typography.labelLarge,
            color = WorkablePrimary,
        )
        Text(
            text = title,
            style = MaterialTheme.typography.headlineMedium,
            color = Color.Black,
        )
        Text(
            text = subtitle,
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Black,
        )
        content()
    }
}
