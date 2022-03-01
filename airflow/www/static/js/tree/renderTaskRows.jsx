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

/* global localStorage */

import React from 'react';
import {
  Tr,
  Td,
  Box,
  Text,
  Flex,
  useDisclosure,
  Collapse,
  useTheme,
} from '@chakra-ui/react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

import StatusBox from './StatusBox';

import { getMetaValue } from '../utils';

// dagId comes from dag.html
const dagId = getMetaValue('dag_id');

const renderTaskRows = ({
  task, containerRef, level = 0, isParentOpen, onSelect, selected, dagRunIds,
}) => task.children.map((t) => (
  <Row
    key={t.id}
    task={t}
    level={level}
    containerRef={containerRef}
    prevTaskId={task.id}
    isParentOpen={isParentOpen}
    onSelect={onSelect}
    selected={selected}
    dagRunIds={dagRunIds}
  />
));

const TaskName = ({
  isGroup = false, isMapped = false, onToggle, isOpen, level, taskName,
}) => (
  <Flex
    as={isGroup ? 'button' : 'div'}
    onClick={() => isGroup && onToggle()}
    aria-label={taskName}
    title={taskName}
    mr={4}
    width="100%"
    alignItems="center"
  >
    <Text
      display="inline"
      fontSize="12px"
      ml={level * 4 + 4}
      isTruncated
    >
      {taskName}
      {isMapped && (
        ' [ ]'
      )}
    </Text>
    {isGroup && (
      isOpen ? <FiChevronDown data-testid="open-group" /> : <FiChevronUp data-testid="closed-group" />
    )}
  </Flex>
);

const TaskInstances = ({
  task, containerRef, dagRunIds, onSelect, selected,
}) => (
  <Flex justifyContent="flex-end">
    {dagRunIds.map((runId) => {
      // Check if an instance exists for the run, or return an empty box
      const instance = task.instances.find((gi) => gi.runId === runId);
      const key = `${runId}-${task.id}`;
      return instance
        ? (
          <StatusBox
            key={key}
            instance={instance}
            containerRef={containerRef}
            group={task}
            onSelect={onSelect}
            selected={selected}
          />
        )
        : <Box key={key} width="16px" data-testid="blank-task" />;
    })}
  </Flex>
);

const Row = (props) => {
  const {
    task,
    containerRef,
    level,
    prevTaskId,
    isParentOpen = true,
    onSelect,
    selected,
    dagRunIds,
  } = props;
  const { colors } = useTheme();
  const hoverBlue = `${colors.blue[100]}50`;
  const isGroup = !!task.children;
  const isSelected = selected.taskId === task.id;

  const taskName = prevTaskId ? task.id.replace(`${prevTaskId}.`, '') : task.id;

  const storageKey = `${dagId}-open-groups`;
  const openGroups = JSON.parse(localStorage.getItem(storageKey)) || [];
  const isGroupId = openGroups.some((g) => g === taskName);
  const onOpen = () => {
    localStorage.setItem(storageKey, JSON.stringify([...openGroups, taskName]));
  };
  const onClose = () => {
    localStorage.setItem(storageKey, JSON.stringify(openGroups.filter((g) => g !== taskName)));
  };
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: isGroupId, onClose, onOpen });

  const parentTasks = task.id.split('.');
  parentTasks.splice(-1);

  const isFullyOpen = isParentOpen && parentTasks.every((p) => openGroups.some((g) => g === p));

  return (
    <>
      <Tr
        bg={isSelected ? 'blue.100' : undefined}
        borderBottomWidth={isFullyOpen ? 1 : 0}
        borderBottomColor="gray.200"
        role="group"
        _hover={!isSelected && { bg: hoverBlue }}
        transition="background-color 0.2s"
      >
        <Td
          bg={isSelected ? 'blue.100' : 'white'}
          _groupHover={!isSelected && ({ bg: 'blue.50' })}
          p={0}
          transition="background-color 0.2s"
          lineHeight="18px"
          position="sticky"
          left={0}
          borderBottom={0}
          zIndex={2}
        >
          <Collapse in={isFullyOpen}>
            <TaskName
              onToggle={onToggle}
              isGroup={isGroup}
              isMapped={task.isMapped}
              taskName={taskName}
              isOpen={isOpen}
              level={level}
            />
          </Collapse>
        </Td>
        <Td width={0} p={0} borderBottom={0} />
        <Td
          p={0}
          align="right"
          borderBottom={0}
        >
          <Collapse in={isFullyOpen}>
            <TaskInstances
              dagRunIds={dagRunIds}
              task={task}
              containerRef={containerRef}
              onSelect={onSelect}
              selected={selected}
            />
          </Collapse>
        </Td>
      </Tr>
      {isGroup && (
        renderTaskRows({
          ...props, level: level + 1, isParentOpen: isOpen,
        })
      )}
    </>
  );
};

export default renderTaskRows;
