import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ActivitySlider, ActivitySliderProps } from './ActivitySlider'

export default {
  title: 'Components/Slider',
  component: ActivitySlider,
} as Meta

const RecentDatasets = {
  data: {
    datasets: {
      edges: [
        {
          node: {
            id: 'ds003620',
            publishDate: '2021-04-20T02:21:41.732Z',
            latestSnapshot: {
              tag: '1.0.0',
              description: {
                Name:
                  'Runabout: A mobile EEG study of auditory oddball processing in laboratory and real-world conditions',
              },
              summary: {
                modalities: ['channels', 'eeg', 'electrodes', 'events'],
              },
            },
          },
        },
        {
          node: {
            id: 'ds003094',
            publishDate: '2021-04-17T20:01:55.162Z',
            latestSnapshot: {
              tag: '1.0.0',
              description: {
                Name: 'Analogical reasoning sequential design fMRI',
              },
              summary: {
                modalities: ['T1w', 'bold', 'events'],
              },
            },
          },
        },
        {
          node: {
            id: 'ds003626',
            publishDate: '2021-04-17T19:51:37.839Z',
            latestSnapshot: {
              tag: '1.0.2',
              description: {
                Name: 'Inner Speech',
              },
              summary: {
                modalities: ['eeg'],
              },
            },
          },
        },
        {
          node: {
            id: 'ds003604',
            publishDate: '2021-04-16T19:52:38.229Z',
            latestSnapshot: {
              tag: '1.0.0',
              description: {
                Name:
                  'A longitudinal neuroimaging dataset on language processing in children ages 5, 7, and 9 years old',
              },
              summary: null,
            },
          },
        },
        {
          node: {
            id: 'ds003612',
            publishDate: '2021-04-16T07:40:42.122Z',
            latestSnapshot: {
              tag: '1.0.0',
              description: {
                Name: 'TODO: name of the dataset',
              },
              summary: {
                modalities: ['T1w', 'bold', 'events', 'fieldmap'],
              },
            },
          },
        },
        {
          node: {
            id: 'ds003606',
            publishDate: '2021-04-10T14:30:12.542Z',
            latestSnapshot: {
              tag: '1.0.0',
              description: {
                Name:
                  'Differences in Chemo-signaling Compound-Evoked Brain Activity in Male and Female Young Adults: A Pilot Study in the Role of Sexual Dimorphism in Olfactory Chemo-Signaling',
              },
              summary: {
                modalities: ['T1w', 'bold', 'events'],
              },
            },
          },
        },
        {
          node: {
            id: 'ds003620',
            publishDate: '2021-04-20T02:21:41.732Z',
            latestSnapshot: {
              tag: '1.0.0',
              description: {
                Name:
                  'Runabout: A mobile EEG study of auditory oddball processing in laboratory and real-world conditions',
              },
              summary: {
                modalities: ['channels', 'eeg', 'electrodes', 'events'],
              },
            },
          },
        },
        {
          node: {
            id: 'ds003094',
            publishDate: '2021-04-17T20:01:55.162Z',
            latestSnapshot: {
              tag: '1.0.0',
              description: {
                Name: 'Analogical reasoning sequential design fMRI',
              },
              summary: {
                modalities: ['T1w', 'bold', 'events'],
              },
            },
          },
        },
        {
          node: {
            id: 'ds003626',
            publishDate: '2021-04-17T19:51:37.839Z',
            latestSnapshot: {
              tag: '1.0.2',
              description: {
                Name: 'Inner Speech',
              },
              summary: {
                modalities: ['eeg'],
              },
            },
          },
        },
      ],
    },
  },
}

const Template: Story<ActivitySliderProps> = args => (
  <ActivitySlider {...args} />
)

export const Recent = Template.bind({})
Recent.args = {
  accessibility: true,
  arrows: true,
  autoplaySpeed: 4000,
  autoplay: false,
  sliderClass: 'recent-slider',
  dots: true,
  draggable: true,
  infinite: true,
  speed: 700,
  slidesToShow: 3,
  slidesToScroll: 3,
  swipeToSlide: true,
  slideHeader: 'Newly Added',
  data: RecentDatasets,
}
