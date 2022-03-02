/*!
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* global stateColors */

import React from 'react';
import {
  Flex,
  Box,
  Tooltip,
  useTheme,
} from '@chakra-ui/react';

import InstanceTooltip from './InstanceTooltip';

const StatusBox = ({
  group, instance, containerRef, onSelect, selected, ...rest
}) => {
  const { runId, taskId } = instance;
  const { colors } = useTheme();
  const hoverBlue = `${colors.blue[100]}50`;

  // Fetch the corresponding column element and set its background color when hovering
  const onMouseEnter = () => {
    if (selected.runId !== runId) {
      [...containerRef.current.getElementsByClassName(`js-${runId}`)]
        .forEach((e) => { e.style.backgroundColor = hoverBlue; });
    }
  };
  const onMouseLeave = () => {
    [...containerRef.current.getElementsByClassName(`js-${runId}`)]
      .forEach((e) => { e.style.backgroundColor = null; });
  };

  const onClick = (e) => {
    e.stopPropagation();
    onMouseLeave();
    onSelect({
      taskId, runId, instance, task: group,
    });
  };

  return (
    <>
      <Tooltip
        label={<InstanceTooltip instance={instance} group={group} />}
        fontSize="md"
        portalProps={{ containerRef }}
        hasArrow
        placement="top"
        openDelay={400}
      >
        <Flex
          p="1px"
          my="1px"
          mx="2px"
          justifyContent="center"
          alignItems="center"
          onClick={onClick}
          cursor={!group.children && 'pointer'}
          data-testid="task-instance"
          zIndex={1}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          {...rest}
        >
          <Box
            width="10px"
            height="10px"
            backgroundColor={stateColors[instance.state] || 'white'}
            borderRadius="2px"
            borderWidth={instance.state ? 0 : 1}
          />
        </Flex>
      </Tooltip>
    </>
  );
};

export default StatusBox;
