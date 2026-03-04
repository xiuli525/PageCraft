import * as React from 'react'
import type { ComponentDefinition } from './types'

import { TextComponent, textDefinition } from './components/Text'
import { HeadingComponent, headingDefinition } from './components/Heading'
import { ButtonComponent, buttonDefinition } from './components/Button'
import { ImageComponent, imageDefinition } from './components/Image'
import { ContainerComponent, containerDefinition } from './components/Container'
import { GridComponent, gridDefinition } from './components/Grid'
import { ColumnsComponent, columnsDefinition } from './components/Columns'
import { SectionComponent, sectionDefinition } from './components/Section'
import { DividerComponent, dividerDefinition } from './components/Divider'
import { SpacerComponent, spacerDefinition } from './components/Spacer'
import { VideoComponent, videoDefinition } from './components/Video'
import { LinkComponent, linkDefinition } from './components/Link'

export const defaultComponents: Map<string, React.ComponentType<Record<string, unknown>>> = new Map(
  [
    ['Text', TextComponent as React.ComponentType<Record<string, unknown>>],
    ['Heading', HeadingComponent as React.ComponentType<Record<string, unknown>>],
    ['Button', ButtonComponent as React.ComponentType<Record<string, unknown>>],
    ['Image', ImageComponent as React.ComponentType<Record<string, unknown>>],
    ['Container', ContainerComponent as React.ComponentType<Record<string, unknown>>],
    ['Grid', GridComponent as React.ComponentType<Record<string, unknown>>],
    ['Columns', ColumnsComponent as React.ComponentType<Record<string, unknown>>],
    ['Section', SectionComponent as React.ComponentType<Record<string, unknown>>],
    ['Divider', DividerComponent as React.ComponentType<Record<string, unknown>>],
    ['Spacer', SpacerComponent as React.ComponentType<Record<string, unknown>>],
    ['Video', VideoComponent as React.ComponentType<Record<string, unknown>>],
    ['Link', LinkComponent as React.ComponentType<Record<string, unknown>>],
  ],
)

export const defaultDefinitions: ComponentDefinition[] = [
  textDefinition,
  headingDefinition,
  buttonDefinition,
  imageDefinition,
  containerDefinition,
  gridDefinition,
  columnsDefinition,
  sectionDefinition,
  dividerDefinition,
  spacerDefinition,
  videoDefinition,
  linkDefinition,
]
